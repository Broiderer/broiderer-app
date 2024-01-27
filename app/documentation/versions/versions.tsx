import styles from './versions.module.scss'

type Version = {
  name: string
  date: string
  tasks: { content: JSX.Element | string; type?: 'task' | 'bug' }[]
}

export default function Versions() {
  const versions: Version[] = [
    {
      name: '1.3.1',
      date: '27/01/2024',
      tasks: [{ content: 'Fix export paths content', type: 'bug' }],
    },
    {
      name: '1.3.0',
      date: '24/01/2024',
      tasks: [
        { content: 'New path option for randomized first step' },
        { content: 'Title, keywords & description improvements for SEO' },
      ],
    },
    {
      name: '1.2.0',
      date: '21/01/2024',
      tasks: [
        { content: 'Option to fit bounds on import' },
        { content: 'Make sure landing pages is ssr' },
        { content: 'Allow stitch filling along specific path' },
      ],
    },
    {
      name: '1.1.0',
      date: '19/01/2024',
      tasks: [
        { content: 'Create the version page in the doc' },
        {
          content:
            'Re-position the imported shapes on the top right corner to avoid mis-interpretation of the bounds on export',
        },
        { content: 'Allow for a different filling setup for each shape' },
      ],
    },
    {
      name: '1.0.1 - first release',
      date: '17/01/2024',
      tasks: [
        { content: 'Editor page with svg import and basic customization.' },
      ],
    },
  ]

  function getEmojiForType(type: Version['tasks'][0]['type'] = 'task'): string {
    switch (type) {
      case 'task': {
        return '🌀'
      }
      case 'bug': {
        return '🤖'
      }
    }
  }

  return (
    <>
      <h2 className="bro-title-2">Changelog</h2>
      {versions.map((version, i) => (
        <div key={i}>
          <h3 className={`${styles['version-name']} bro-title-3`}>
            {version.name}
          </h3>
          <p className={styles['version-date']}>{version.date}</p>
          <div className={styles['version-tasks']}>
            {version.tasks.map((task, j) => (
              <p key={j}>
                {getEmojiForType(task.type)} {task.content}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
