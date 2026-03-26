const LINE_CLASS_MAP = {
  Entrada: "entrada",
  Intermediario: "intermediario",
  "Alto Desempenho": "alto-desempenho",
};

export const getLinhaInfo = (nomeProduto) => {
  if (!String(nomeProduto).includes("|")) {
    return {
      linha: "Sem linha",
      nomeExibicao: nomeProduto,
      linhaClasse: "outros",
    };
  }

  const [linhaRaw, nomeRaw] = String(nomeProduto)
    .split("|")
    .map((parte) => parte.trim());

  return {
    linha: linhaRaw,
    nomeExibicao: nomeRaw,
    linhaClasse: LINE_CLASS_MAP[linhaRaw] ?? "outros",
  };
};
