package service

import (
"backend/repository"
)

type Service struct {
repo *repository.Repository
}

func NewService(repo *repository.Repository) *Service {
return &Service{
repo: repo,
}
}

func (s *Service) CreateEvent(event *repository.Event) error {
return s.repo.CreateEvent(event)
}

func (s *Service) GetAllEvents() ([]repository.Event, error) {
return s.repo.GetAllEvents()
}
