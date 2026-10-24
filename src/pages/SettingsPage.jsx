import { useSettings } from "../context/SettingsContext"
import "./SettingsPage.css"

function SettingsPage() {
  const { userName, setUserName } = useSettings()

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
    </section>
  )
}

export default SettingsPage