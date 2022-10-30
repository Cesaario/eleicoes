import axios from "axios";
import chalk from "chalk";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ufs = [
  "AC",
  "AM",
  "RO",
  "RR",
  "AP",
  "AL",
  "PA",
  "BA",
  "CE",
  "MA",
  "PB",
  "PE",
  "PI",
  "RN",
  "SE",
  "TO",
  "DF",
  "GO",
  "MT",
  "MS",
  "MG",
  "RJ",
  "ES",
  "SP",
  "PR",
  "RS",
  "SC",
  "BR",
];

const run = async () => {
  const resultados = [];
  for (const uf of ufs) {
    try {
      const url = `https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/${uf.toLocaleLowerCase()}/${uf.toLocaleLowerCase()}-c0001-e000544-r.json`;
      const { data } = await axios.get(url);
      const candidatos = data.cand
        .filter((c) => c.n === "13" || c.n === "22")
        .sort((a, b) => parseInt(a.n) - parseInt(b.n));
      if (candidatos.length < 2) console.log("como assim porra");
      const lula = candidatos.find((c) => c.n === "13");
      const bolsonaro = candidatos.find((c) => c.n === "22");
      resultados.push({
        bom: parseInt(lula.vap) > parseInt(bolsonaro.vap),
        br: uf === "BR",
        texto: `${uf} (${data.pst}): \t ${candidatos[0].nm}: ${candidatos[0].pvap}% \t\t ${candidatos[1].nm}: ${candidatos[1].pvap}%`,
      });
    } catch (e) {
      console.log(chalk.red("ERRO!!!"));
    }
    delay(500);
  }
  console.clear();
  for (const resultado of resultados) {
    const cor = resultado.br
      ? chalk.yellow
      : resultado.bom
      ? chalk.green
      : chalk.red;
    console.log(cor(resultado.texto));
  }
  console.log(`Atualizado em: ${new Date().toLocaleTimeString()}`);
};

setInterval(run, 2 * 60 * 1000);
