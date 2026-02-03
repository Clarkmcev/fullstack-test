package handler

import (
	"encoding/json"
	"net/http"

	"backend/repository"
	"backend/service"
)

type Handler struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /", h.HealthCheck)
	mux.HandleFunc("POST /events", h.CreateEvent)
	mux.HandleFunc("GET /events", h.GetEvents)
}

func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

type CreateEventRequest struct {
	Type            string                 `json:"type"`
	Description     string                 `json:"description"`
	Budget          float64                `json:"budget"`
	NumberOfPersons int                    `json:"numberOfPersons"`
	Date            string                 `json:"date"`
	Payload         map[string]interface{} `json:"payload"`
}

func (h *Handler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	var req CreateEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Type == "" || req.Description == "" || req.Date == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Convert payload to JSON
	payloadJSON, err := json.Marshal(req.Payload)
	if err != nil {
		http.Error(w, "Invalid payload format", http.StatusBadRequest)
		return
	}

	event := &repository.Event{
		Type:            req.Type,
		Description:     req.Description,
		Budget:          req.Budget,
		NumberOfPersons: req.NumberOfPersons,
		Date:            req.Date,
		Payload:         payloadJSON,
	}

	if err := h.service.CreateEvent(event); err != nil {
		http.Error(w, "Failed to create event", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(event)
}

func (h *Handler) GetEvents(w http.ResponseWriter, r *http.Request) {
	events, err := h.service.GetAllEvents()
	if err != nil {
		http.Error(w, "Failed to fetch events", http.StatusInternalServerError)
		return
	}

	if events == nil {
		events = []repository.Event{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"events": events,
	})
}
