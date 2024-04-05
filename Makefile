.PHONY: serve
serve:
	@echo "Starting the Python server..."
	@python3 -m http.server &
	@sleep 2
	@echo "Opening the default web browser..."
	@open http://localhost:8000
