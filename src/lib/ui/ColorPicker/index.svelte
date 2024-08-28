<script>
    export let color = '#ffffff';
  </script>
  
  <div class="color-picker-container">
    <label for="color-picker" class="color-picker-label">User Accent Color</label>
    <div>
        <input name="userAccentColor" type="color" id="color-picker" bind:value={color} class="color-picker-input"/>
        <span class="color-value">{color}</span>
    </div>
  </div>
  
  <style>
    .color-picker-container {
      display: flex;
      flex-direction: column;
      background-color: var(--menu-bg);
      padding: 10px;
      border-radius: 8px;
      gap: 10px;
      margin-bottom: 15px;
      font-family: 'Source Sans 3';
    }
    .color-picker-container div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
  
    .color-picker-label {
      font-size: 16px;
      color: #fff;
    }
  
    .color-picker-input {
      appearance: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
    }
  
    .color-picker-input::-webkit-color-swatch {
      border: 2px solid #555;
      border-radius: 50%;
    }
  
    .color-picker-input::-webkit-color-swatch-wrapper {
      padding: 2px;
      border-radius: 50%;
    }
  
    .color-value {
      font-size: 14px;
      color: #aaa;
      margin-left: 10px;
    }
  </style>