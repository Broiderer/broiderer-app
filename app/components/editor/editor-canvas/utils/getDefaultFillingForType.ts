import { Filling } from '@/app/components/editor/utils/stitch'
import * as paper from 'paper'

export function getDefaultFillingForType(type: Filling['type']): Filling {
  switch (type) {
    case 'linear': {
      return { type, gap: 4, innerGap: 20, angle: Math.PI / 6 }
    }
    case 'along': {
      return { type, gap: 10, innerGap: 20, path: new paper.Path(), offset: 10 }
    }
    case 'radial': {
      return { type, angle: 0.1, around: { x: 0, y: 0 }, innerGap: 20 }
    }
  }
}
