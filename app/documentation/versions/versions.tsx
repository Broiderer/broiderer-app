import styles from './versions.module.scss'

type Version = {
  name: string
  tasks: (JSX.Element | string)[]
}

export default function Versions() {
  const versions: Version[] = [
    {
      name: '1.0.1 - first release',
      tasks: ['Editor page with svg import and basic customization.'],
    },
  ]

  return (
    <>
      <h2 className="bro-title-2">Versions</h2>
      {versions.map((version, i) => (
        <div key={i}>
          <h3 className={`${styles['version-name']} bro-title-3`}>
            {version.name}
          </h3>
          {version.tasks.map((task, j) => (
            <p key={j}>✅ {task}</p>
          ))}
        </div>
      ))}
    </>
  )
}
