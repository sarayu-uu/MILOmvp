import {ContinueButton} from './play/ContinueButton'
import { freshShuffle } from './variation'
import { useEffect, useState } from 'react'
import { Check, Leaf } from 'lucide-react'

const foods = {
  apple: { picture: '🍎', label: 'Apple' },
  banana: { picture: '🍌', label: 'Banana' },
  carrot: { picture: '🥕', label: 'Carrot' },
  pear: { picture: '🍐', label: 'Pear' },
  strawberry: { picture: '🍓', label: 'Strawberry' },
}
type Food = keyof typeof foods
const picnic: Food[] = ['apple', 'banana', 'carrot']
const choices: Food[] = ['pear', 'carrot', 'apple', 'strawberry', 'banana']

export function PicnicActivity({ hard, onInstruction, onHint, onComplete }: {
  hard: boolean
  onInstruction: (instruction: string) => void
  onHint: (instruction: string) => void
  onComplete: () => void
}) {
  const [phase, setPhase] = useState<'look' | 'remember' | 'finished'>('look')
  const [recalled, setRecalled] = useState<Food[]>([])
  const [misses, setMisses] = useState(0)
  const [sequence] = useState(() => freshShuffle('picnic-foods', picnic))
  const [options] = useState(() => freshShuffle('picnic-choices', choices))
  const instruction = phase === 'look'
    ? hard ? 'Look at our picnic foods, from left to right.' : 'Remember these 3 foods. Hide them, then tap the foods you remember.'
    : phase === 'finished' ? 'Our picnic is ready to share!'
    : hard ? ['Which food was first?', 'Which food came next?', 'Which food was last?'][recalled.length]
    : ['Which three foods were on the blanket?', 'You found one! Which other foods were here?', 'One more food to find!'][recalled.length]

  useEffect(() => { onInstruction(instruction) }, [instruction, onInstruction])

  function select(food: Food) {
    if (phase !== 'remember' || recalled.includes(food)) return
    if (hard ? food !== sequence[recalled.length] : !sequence.includes(food)) {
      setMisses(n => n + 1)
      onHint(misses > 0
        ? 'Let’s peek at the picnic together. Tap “Look again”.'
        : 'Hmm… that wasn’t the food here. You can look again.')
      return
    }
    const next = [...recalled, food]
    setRecalled(next)
    setMisses(0)
    if (next.length === sequence.length) {
      setPhase('finished')
      onComplete()
    }
  }

  return <div className="picnic-activity">
    <div className={`picnic picnic-blanket ${phase === 'finished' ? 'picnic-ready' : ''}`} aria-label="Picnic blanket">
      {sequence.map((food, i) => {
        const visible = phase !== 'remember' || recalled.includes(food)
        return <div className={`picnic-place ${visible ? 'revealed' : ''}`} key={food}>
          {hard && <small>{i + 1}</small>}
          <span role="img" aria-label={visible ? foods[food].label : `Covered food ${i + 1}`}>
            {visible ? foods[food].picture : <Leaf size={58} aria-hidden="true"/>}
          </span>
          <small>{visible ? foods[food].label : '?'}</small>
        </div>
      })}
    </div>
    {phase === 'look' && <>
      <p className="subtle">Take your time. Tap when you’re ready.</p>
      <ContinueButton className="primary" onClick={() => { setPhase('remember'); setMisses(0) }}>Ready! Hide the food <Leaf size={18}/></ContinueButton>
    </>}
    {phase === 'remember' && <>
      <div className="choices" aria-label="Choose the missing food">
        {options.map(food =>
          <button className="object-choice" key={food} aria-label={foods[food].label}
            disabled={recalled.includes(food)} onClick={() => select(food)}>
            <span aria-hidden="true">{foods[food].picture}</span>
            <small>{foods[food].label}{recalled.includes(food) && <Check size={15}/>}</small>
          </button>)}
      </div>
      <button className={`text-button ${misses > 1 ? 'picnic-peek' : ''}`} onClick={() => {
        setPhase('look'); setRecalled([]); setMisses(0)
      }}>Look again</button>
    </>}
  </div>
}
