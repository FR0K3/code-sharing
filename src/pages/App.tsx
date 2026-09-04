import background from '/images/background-notecode.svg'
import noteCodeLogo from '../assets/icons/NoteCodeLogo.svg'
import EditorContainer from '../components/EditorContainer'

function App() {

  return (
    <section className="relative w-full min-h-screen overflow-x-hidden">
      <img
        className="absolute -top-16 left-1/2 -translate-x-1/2 min-w-7xl w-full max-w-none"
        src={background}
        draggable={false}
        alt="Background image"
        fetchPriority="high"
      />

      <div className="relative z-10 pt-9 pb-28 w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            className="w-28 mb-4"
            src={noteCodeLogo}
            alt="NoteCode Logo"
          />
          <h1 className="text-small-heading font-bold">Create & Share</h1>
          <h1 className="text-large-heading font-bold">Your Code easily</h1>
        </div>

        <EditorContainer />

      </div>
    </section>
  )
}

export default App
