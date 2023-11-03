import { ReactNode, createContext, useState, useReducer } from 'react'
import { Cycle, cyclesReducer } from '../redurcers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../redurcers/cycles/actions'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CycleContextProviderProps {
  children: ReactNode
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycledAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interrupCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,

    {
      cycles: [],
      activeCycleId: null,
    },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycledAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interrupCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycledAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interrupCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
