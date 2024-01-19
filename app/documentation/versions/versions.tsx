import styles from './versions.module.scss'

type Version = {
  name: string
  date: string
  tasks: (JSX.Element | string)[]
}

export default function Versions() {
  const versions: Version[] = [
    {
      name: '1.1.0',
      date: '19/01/2024',
      tasks: [
        'Create the version page in the doc',
        'Re-position the imported shapes on the top right corner to avoid mis-interpretation of the bounds on export',
        'Allow for a different filling setup for each shape',
      ],
    },
    {
      name: '1.0.1 - first release',
      date: '17/01/2024',
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
          <p className={styles['version-date']}>{version.date}</p>
          <div className={styles['version-tasks']}>
            {version.tasks.map((task, j) => (
              <p key={j}>✅ {task}</p>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
