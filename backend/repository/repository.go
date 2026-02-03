package repository

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Event struct {
	ID              string          `json:"id"`
	Type            string          `json:"type"`
	Description     string          `json:"description"`
	Budget          float64         `json:"budget"`
	NumberOfPersons int             `json:"numberOfPersons"`
	Date            string          `json:"date"`
	Payload         json.RawMessage `json:"payload"`
	CreatedAt       time.Time       `json:"createdAt"`
}

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) CreateEvent(event *Event) error {
	query := `
INSERT INTO events (id, type, description, budget, number_of_persons, date, payload, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

	event.ID = uuid.New().String()
	event.CreatedAt = time.Now()

	_, err := r.db.Exec(
		query,
		event.ID,
		event.Type,
		event.Description,
		event.Budget,
		event.NumberOfPersons,
		event.Date,
		event.Payload,
		event.CreatedAt,
	)

	return err
}

func (r *Repository) GetAllEvents() ([]Event, error) {
	query := `
SELECT id, type, description, budget, number_of_persons, date, payload, created_at
FROM events
ORDER BY created_at DESC
`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var event Event
		err := rows.Scan(
			&event.ID,
			&event.Type,
			&event.Description,
			&event.Budget,
			&event.NumberOfPersons,
			&event.Date,
			&event.Payload,
			&event.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}

func (r *Repository) InitSchema() error {
	query := `
CREATE TABLE IF NOT EXISTS events (
id VARCHAR(255) PRIMARY KEY,
type VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
budget DECIMAL(10, 2) NOT NULL,
number_of_persons INT NOT NULL,
date VARCHAR(255) NOT NULL,
payload JSONB NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`

	_, err := r.db.Exec(query)
	return err
}
