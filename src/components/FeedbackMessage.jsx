export function FeedbackMessage({ erro, sucesso }) {
  return (
    <>
      {erro ? (
        <p
          className="feedback feedback-error"
          role="alert"
          aria-live="assertive"
        >
          {erro}
        </p>
      ) : null}
      {sucesso ? (
        <p
          className="feedback feedback-success"
          role="status"
          aria-live="polite"
        >
          {sucesso}
        </p>
      ) : null}
    </>
  );
}
