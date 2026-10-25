import { useSettings } from "../context/SettingsContext"
import { useNotes } from "../context/NotesContext"
import "./SettingsPage.css"

const THEMES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

function SettingsPage() {
  const { userName, setUserName, theme, setTheme } = useSettings()
  const { addTestNotes, removeTestNotes } = useNotes()

  return (
    <section className="settings">
      <h2>Settings</h2>

      <label htmlFor="userName">Your name</label>
      <input
        id="userName"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name"
        maxLength={30}
      />
      <p className="settings__hint">Shown in the greeting on the notes page.</p>

      <fieldset className="theme-picker">
        <legend>Theme</legend>
        <div className="theme-picker__options">
          {THEMES.map(({ value, label }) => (
            <label key={value} className="theme-picker__option">
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {import.meta.env.DEV && (
        <div className="dev-tools">
          <h3>Developer tools</h3>
          <p>Only visible while running npm run dev.</p>
          <div className="dev-tools__buttons">
            <button type="button" onClick={() => addTestNotes(500)}>
              Add 500 test notes
            </button>
            <button type="button" onClick={removeTestNotes}>
              Remove test notes
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SettingsPage