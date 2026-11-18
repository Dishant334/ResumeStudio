import { getTemplate } from '../templates/registry'
import { sampleResume } from '../templates/sampleData'

// Renders a real template at a fixed small scale (decorative, non-interactive)
const MiniResume = ({ template, width = 300, accent = '#e4572e', className = '', style }) => {
  const T = getTemplate(template).Component
  const scale = width / 794
  return (
    <div className={`overflow-hidden bg-white ${className}`} style={{ width, height: width * 1.3, ...style }}>
      <div className='origin-top-left pointer-events-none select-none resume-page' style={{ width: 794, transform: `scale(${scale})` }}>
        <T data={sampleResume} accentColor={accent} />
      </div>
    </div>
  )
}
export default MiniResume
