import { useState, type FormEvent } from "react"
import { Check, Monitor, RotateCcw, Save } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { agents } from "@/data/support"
import { Avatar, PageHeading } from "./common"

export function SettingsPage({
  workspaceName,
  onSave,
  onReset,
}: {
  workspaceName: string
  onSave: (name: string) => void
  onReset: () => void
}) {
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(workspaceName)
  const [feedback, setFeedback] = useState("")
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      setFeedback("Enter a workspace name.")
      return
    }
    onSave(name.trim())
    setFeedback("Workspace name saved for this session.")
  }
  return (
    <>
      <PageHeading
        title="Settings"
        description="Make this space feel like your team’s."
      />
      <div className="settings-stack">
        <section className="panel settings-panel">
          <div className="panel-heading">
            <div>
              <h2>Workspace details</h2>
              <p>A shared home for your customer conversations.</p>
            </div>
          </div>
          <form onSubmit={save} className="settings-form">
            <label>
              Workspace name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
              />
            </label>
            <div className="settings-form-footer">
              <p className="form-feedback" role="status">
                {feedback}
              </p>
              <button className="btn primary" type="submit">
                <Save size={15} />
                Save changes
              </button>
            </div>
          </form>
        </section>
        <section className="panel settings-panel">
          <div className="panel-heading">
            <div>
              <h2>Appearance</h2>
              <p>Choose the look that works best for you.</p>
            </div>
            <Monitor size={19} className="muted" />
          </div>
          <div className="theme-options" role="group" aria-label="Color theme">
            {(["light", "dark", "system"] as const).map((option) => (
              <button
                key={option}
                className={`theme-option ${theme === option ? "selected" : ""}`}
                aria-pressed={theme === option}
                onClick={() => setTheme(option)}
              >
                <span className={`theme-preview ${option}`}>
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  {option === "system"
                    ? "System default"
                    : `${option[0].toUpperCase()}${option.slice(1)}`}{" "}
                  {theme === option && <Check size={15} />}
                </span>
              </button>
            ))}
          </div>
          <p className="settings-hint">
            You can also press <kbd>D</kbd> to switch between light and dark.
          </p>
        </section>
        <section className="panel settings-panel">
          <div className="panel-heading">
            <div>
              <h2>Your support team</h2>
              <p>Four friendly faces behind the inbox.</p>
            </div>
            <span className="count-bubble">4</span>
          </div>
          <div className="team-list">
            {agents.map((agent, index) => (
              <div className="team-member" key={agent}>
                <Avatar
                  name={agent}
                  color={["mint", "lavender", "peach", "blue"][index]}
                />
                <div>
                  <strong>{agent}</strong>
                  <small>
                    {index === 0 ? "Workspace admin" : "Support specialist"}
                  </small>
                </div>
                <span className="plan-badge">
                  {index === 0 ? "Admin" : "Member"}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel settings-panel demo-settings">
          <div>
            <h2>Demo workspace</h2>
            <p>
              Tickets, replies, and workspace changes live in browser memory.
              Refreshing restores the sample data. Your appearance preference is
              saved on this device.
            </p>
          </div>
          <button
            className="btn"
            onClick={() => {
              onReset()
              setName("Acme Support")
              setFeedback("Demo tickets and workspace name have been reset.")
            }}
          >
            <RotateCcw size={15} />
            Reset demo data
          </button>
        </section>
      </div>
    </>
  )
}
