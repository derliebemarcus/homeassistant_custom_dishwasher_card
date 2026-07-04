# Runtime scenarios

## Render current appliance state

1. Home Assistant supplies the frontend state object.
2. The card resolves configured or discovered entities.
3. Entity states are normalized into the card view model.
4. Available controls and status fields are rendered.

## Start or stop a programme

1. The user selects an available action.
2. The card validates capability and required confirmation.
3. A Home Assistant service call is issued.
4. Subsequent entity updates refresh the displayed state.
