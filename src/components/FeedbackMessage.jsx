export function FeedbackMessage({ erro, sucesso }) {
  return (
    <>
      {erro ? <p className="feedback feedback-error">{erro}</p> : null}
      {sucesso ? <p className="feedback feedback-success">{sucesso}</p> : null}
    </>
  )
}
