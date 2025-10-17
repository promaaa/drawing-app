import './Toolbar.css'
import { useState, useEffect } from 'react';
import { PersistentElements } from './PersistentElement';
import type { DrawingModeName } from './canvas/useDrawingMode';

interface ToolbarProps {
  persistentElements: PersistentElements | null;
  setMode: (modeName: DrawingModeName) => void;
}

function Toolbar({ persistentElements, setMode }: ToolbarProps) {
  const [backgroundColor, setBackgroundColorState] = useState("#0d00ff");
  const [foregroundColor, setForegroundColorState] = useState("#000000");
  const [lineWidth, setLineWidthState] = useState(2);

  useEffect(() => {
    if (persistentElements) {
      setBackgroundColorState(persistentElements.backgroundColor);
      setForegroundColorState(persistentElements.foregroundColor);
      setLineWidthState(persistentElements.linewidth);
    }
  }, [persistentElements]);

  const handleToolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const toolValue = event.target.value;
    let modeName: DrawingModeName;
    switch (toolValue) {
      case 'move': modeName = 'selectMove'; break;
      case 'pencil': modeName = 'pencil'; break;
      case 'line': modeName = 'line'; break;
      case 'rectangle': modeName = 'rectangle'; break;
      case 'ellipse': modeName = 'ellipse'; break;
      default: modeName = 'selectMove'; break;
    }
    setMode(modeName);
  };

  const handleDelete = () => {
    if (persistentElements) {
      persistentElements.removeSelectedItem();
    }
  };

  const handleClone = () => {
    if (persistentElements) {
      persistentElements.duplicateSelectedItem();
    }
  };

  return (
    <div id="toolbar">
      <fieldset>
            <legend>Tools</legend>
            <div>
              <input type="radio" id="move" name="tool" value="move" defaultChecked onChange={handleToolChange} />
              <label htmlFor="move">Select&Move</label>
            </div>
            <div>
              <input type="radio" id="pencil" name="tool" value="pencil" onChange={handleToolChange} />
              <label htmlFor="pencil">Pencil</label>
            </div>
            <div>
              <input type="radio" id="line" name="tool" value="line" onChange={handleToolChange} />
              <label htmlFor="line">Line</label>
            </div>
            <div>
              <input type="radio" id="rectangle" name="tool" value="rectangle" onChange={handleToolChange} />
              <label htmlFor="rectangle">Rectangle</label>
            </div>
            <div>
              <input type="radio" id="ellipse" name="tool" value="ellipse" onChange={handleToolChange} />
              <label htmlFor="ellipse">Ellipse</label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Style</legend>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="background-color">Fill color:</label>
                  </td>
                  <td>
                    <input className='input-color' type="color" id="background-color" 
                           value={backgroundColor}
                           onChange={(e) => {
                             const color = e.target.value;
                             setBackgroundColorState(color);
                             persistentElements?.setBackgroundColor(color);
                           }} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="foreground-color">Outline:</label>
                  </td>
                  <td>
                    <input className='input-color' type="color" id="foreground-color" 
                           value={foregroundColor}
                           onChange={(e) => {
                             const color = e.target.value;
                             setForegroundColorState(color);
                             persistentElements?.setForegroundColor(color);
                           }} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="line-width">Line width:</label>
                  </td>
                  <td>
                    <input className='input-width' type="number" id="line-width" min="0" max="10" 
                           value={lineWidth}
                           onChange={(e) => {
                             const width = Number(e.target.value);
                             setLineWidthState(width);
                             persistentElements?.setLineWidth(width);
                           }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
          <fieldset className='actions-fieldset'>
            <legend>Actions</legend>
            <button id="delete-button" onClick={handleDelete}>Delete</button>
            <button id="clone-button" onClick={handleClone}>Clone</button>
          </fieldset>
    </div>
  );
}

export default Toolbar;