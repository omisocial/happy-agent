#!/bin/bash

# ==============================================================================
# HappyAgent Orchestrator Bash Loop
# ==============================================================================
# This script keeps the automation running and triggers the AI Healer
# when Playwright encounters a selector error (Exit Code 1).
# ==============================================================================

MAX_HEAL_ATTEMPTS=3
HEAL_COUNT=0

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit 1

echo "========================================================"
echo "🚀 Starting HappyAgent Self-Healing Loop"
echo "========================================================"

while true; do
  # Run the Node.js orchestrator
  node src/orchestrator.js
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ [BASH] Orchestrator finished successfully. All done!"
    break
  elif [ $EXIT_CODE -eq 1 ]; then
    if [ $HEAL_COUNT -lt $MAX_HEAL_ATTEMPTS ]; then
      echo "🔧 [BASH] Selector error detected (Code 1)."
      echo "         Calling AI Healer (attempt $((HEAL_COUNT+1))/$MAX_HEAL_ATTEMPTS)..."
      
      # Run the Healer
      node src/healer.js
      HEAL_RESULT=$?
      
      if [ $HEAL_RESULT -eq 0 ]; then
        echo "✅ [BASH] AI Healer succeeded! Resuming orchestrator in 5s..."
        HEAL_COUNT=$((HEAL_COUNT+1))
        sleep 5
      else
        echo "❌ [BASH] AI Healer failed to fix the issue. Manual intervention needed."
        break
      fi
    else
      echo "🛑 [BASH] Maximum heal attempts ($MAX_HEAL_ATTEMPTS) reached."
      echo "         The layout might have significantly changed."
      break
    fi
  else
    echo "❌ [BASH] Orchestrator crashed with Code $EXIT_CODE."
    echo "         Not a selector error. Stopping loop."
    break
  fi
done

echo "========================================================"
echo "🛑 Loop terminated."
echo "========================================================"
