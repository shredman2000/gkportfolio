# GK Portfolio

A personal portfolio project built with a React/Vite frontend, a Spring Boot backend, and a Docker-based local development setup. This repo showcases a few small apps, portfolio pages, and integration work that brings everything together.

## What’s included

- frontend — React + Vite single-page application with portfolio sections, project pages, and a few demo features.
- backend — Spring Boot application for backend APIs, demo data, and support services.
- nginx — reverse proxy configuration intended for containerized deployments.
- Docker

## Frontend highlights

The portfolio front end includes:

- Home, About Me, Contact, and Projects pages
- Movie page and movie connections features
- BetTheBracket - a March Madness betting platform.
- A chatbot component
- A type test page and several reusable UI components

## How to run locally

### Development

docker compose -f docker-compose.dev.yml up

This starts services in development mode and keeps the local setup easy to work with.

### Production-style

docker compose up --build

This builds the containers and starts the application in a production-like configuration.

## Shortcut commands

The project also supports the following commands for local development work:

- `npm run dev` — start the frontend in development mode
- `npm run dev -- --mode production` — start the frontend with production proxy settings

## Notes

- The backend includes Maven configuration and test scaffolding.
- The frontend is organized around a clean component structure and includes dedicated CSS files for each page.
- The Docker setup is designed so the project can run locally without needing to install everything globally.
