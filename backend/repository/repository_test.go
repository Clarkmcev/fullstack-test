package repository

import (
	"database/sql"
	"encoding/json"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewRepository(t *testing.T) {
	db, _, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	repo := NewRepository(db)
	assert.NotNil(t, repo)
	assert.Equal(t, db, repo.db)
}

func TestRepository_CreateEvent(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	repo := NewRepository(db)

	tests := []struct {
		name      string
		event     *Event
		mockSetup func()
		wantErr   bool
	}{
		{
			name: "successful creation with complete payload",
			event: &Event{
				Type:            "Conference",
				Description:     "Tech Conference 2024",
				Budget:          5000.00,
				NumberOfPersons: 100,
				Date:            "2024-12-25",
				Payload:         json.RawMessage(`{"type":"Conference","description":"Tech Conference 2024","budget":5000,"numberOfPersons":100,"date":"2024-12-25"}`),
			},
			mockSetup: func() {
				mock.ExpectExec("INSERT INTO events").
					WithArgs(
						sqlmock.AnyArg(), // ID (UUID)
						"Conference",
						"Tech Conference 2024",
						5000.00,
						100,
						"2024-12-25",
						json.RawMessage(`{"type":"Conference","description":"Tech Conference 2024","budget":5000,"numberOfPersons":100,"date":"2024-12-25"}`),
						sqlmock.AnyArg(), // CreatedAt
					).
					WillReturnResult(sqlmock.NewResult(1, 1))
			},
			wantErr: false,
		},
		{
			name: "successful creation with wedding event",
			event: &Event{
				Type:            "Wedding",
				Description:     "Summer Garden Wedding",
				Budget:          15000.50,
				NumberOfPersons: 150,
				Date:            "2024-06-15",
				Payload:         json.RawMessage(`{"type":"Wedding","description":"Summer Garden Wedding","budget":15000.5,"numberOfPersons":150,"date":"2024-06-15"}`),
			},
			mockSetup: func() {
				mock.ExpectExec("INSERT INTO events").
					WithArgs(
						sqlmock.AnyArg(), // ID (UUID)
						"Wedding",
						"Summer Garden Wedding",
						15000.50,
						150,
						"2024-06-15",
						json.RawMessage(`{"type":"Wedding","description":"Summer Garden Wedding","budget":15000.5,"numberOfPersons":150,"date":"2024-06-15"}`),
						sqlmock.AnyArg(), // CreatedAt
					).
					WillReturnResult(sqlmock.NewResult(1, 1))
			},
			wantErr: false,
		},
		{
			name: "database error",
			event: &Event{
				Type:            "Workshop",
				Description:     "Design Workshop",
				Budget:          1000.00,
				NumberOfPersons: 20,
				Date:            "2024-11-15",
				Payload:         json.RawMessage(`{"type":"Workshop","description":"Design Workshop","budget":1000,"numberOfPersons":20,"date":"2024-11-15"}`),
			},
			mockSetup: func() {
				mock.ExpectExec("INSERT INTO events").
					WillReturnError(sql.ErrConnDone)
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockSetup()

			err := repo.CreateEvent(tt.event)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotEmpty(t, tt.event.ID)
				_, err := uuid.Parse(tt.event.ID)
				assert.NoError(t, err, "ID should be a valid UUID")
				assert.False(t, tt.event.CreatedAt.IsZero())
			}

			assert.NoError(t, mock.ExpectationsWereMet())
		})
	}
}

func TestRepository_GetAllEvents(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	repo := NewRepository(db)

	tests := []struct {
		name      string
		mockSetup func()
		wantCount int
		wantErr   bool
	}{
		{
			name: "successful retrieval with events",
			mockSetup: func() {
				rows := sqlmock.NewRows([]string{
					"id", "type", "description", "budget", "number_of_persons", "date", "payload", "created_at",
				}).
					AddRow(
						"550e8400-e29b-41d4-a716-446655440000",
						"Conference",
						"Tech Conference 2024",
						5000.00,
						100,
						"2024-12-25",
						json.RawMessage(`{"type":"Conference","description":"Tech Conference 2024","budget":5000,"numberOfPersons":100,"date":"2024-12-25"}`),
						time.Now(),
					).
					AddRow(
						"550e8400-e29b-41d4-a716-446655440001",
						"Birthday",
						"30th Birthday Celebration",
						2500.00,
						50,
						"2024-08-20",
						json.RawMessage(`{"type":"Birthday","description":"30th Birthday Celebration","budget":2500,"numberOfPersons":50,"date":"2024-08-20"}`),
						time.Now(),
					).
					AddRow(
						"550e8400-e29b-41d4-a716-446655440002",
						"Workshop",
						"Design Workshop",
						1000.00,
						20,
						"2024-11-15",
						json.RawMessage(`{"type":"Workshop","description":"Design Workshop","budget":1000,"numberOfPersons":20,"date":"2024-11-15"}`),
						time.Now(),
					)

				mock.ExpectQuery("SELECT (.+) FROM events").WillReturnRows(rows)
			},
			wantCount: 3,
			wantErr:   false,
		},
		{
			name: "empty result",
			mockSetup: func() {
				rows := sqlmock.NewRows([]string{
					"id", "type", "description", "budget", "number_of_persons", "date", "payload", "created_at",
				})
				mock.ExpectQuery("SELECT (.+) FROM events").WillReturnRows(rows)
			},
			wantCount: 0,
			wantErr:   false,
		},
		{
			name: "database error",
			mockSetup: func() {
				mock.ExpectQuery("SELECT (.+) FROM events").WillReturnError(sql.ErrConnDone)
			},
			wantCount: 0,
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockSetup()

			events, err := repo.GetAllEvents()

			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, events)
			} else {
				assert.NoError(t, err)
				assert.Len(t, events, tt.wantCount)

				if tt.wantCount > 0 {
					assert.NotEmpty(t, events[0].ID)
					assert.NotEmpty(t, events[0].Type)
				}
			}

			assert.NoError(t, mock.ExpectationsWereMet())
		})
	}
}

func TestRepository_InitSchema(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	repo := NewRepository(db)

	tests := []struct {
		name      string
		mockSetup func()
		wantErr   bool
	}{
		{
			name: "successful schema initialization",
			mockSetup: func() {
				mock.ExpectExec("CREATE TABLE IF NOT EXISTS events").
					WillReturnResult(sqlmock.NewResult(0, 0))
			},
			wantErr: false,
		},
		{
			name: "database error",
			mockSetup: func() {
				mock.ExpectExec("CREATE TABLE IF NOT EXISTS events").
					WillReturnError(sql.ErrConnDone)
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockSetup()

			err := repo.InitSchema()

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			assert.NoError(t, mock.ExpectationsWereMet())
		})
	}
}
