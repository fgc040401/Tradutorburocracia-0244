import { useState } from "react";
import {
  AlignLeft,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCheck,
  CircleAlert,
  Copy,
  ListChecks,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { DocumentResult } from "../../shared/document";

export function AnalysisDashboard({
  result,
  onReset,
}: {
  result: DocumentResult;
  onReset: () => void;
}) {
  const [checked, setChecked] = useState<number[]>([]);
  const [copyState, setCopyState] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.summary);
      setCopyState("Resumo copiado!");
    } catch {
      setCopyState("Não foi possível copiar. Use a opção de baixar.");
    }
  }
  function download() {
    const content = `${result.mode === "mock" ? "DEMONSTRAÇÃO SIMULADA — NÃO É ANÁLISE DO TEXTO ENVIADO\n\n" : ""}${result.title}\n\nRESUMO EXECUTIVO\n${result.summary}\n\nRADAR DE PEGADINHAS\n${result.alerts.map((a) => `• ${a.title}: ${a.description}`).join("\n")}\n\nDICIONÁRIO DESCOMPLICADO\n${result.dictionary.map((d) => `• ${d.term}: ${d.translation}`).join("\n")}\n\nPRÓXIMOS PASSOS\n${result.steps.map((s, i) => `${checked.includes(i) ? "[x]" : "[ ]"} ${s}`).join("\n")}\n\nMaterial informativo. Não substitui a orientação de um profissional jurídico.`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "documento-descomplicado.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="results reveal" aria-label="Documento descomplicado">
      <div className="results-heading">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} /> CLAREZA, EM POUCOS MINUTOS
          </div>
          <h1>Seu documento, descomplicado.</h1>
          <p>O que importa, o que merece atenção e o que fazer agora.</p>
        </div>
        <button className="secondary-button" onClick={onReset}>
          <ArrowLeft size={16} /> Novo documento
        </button>
      </div>
      {result.mode === "mock" && (
        <div className="demo-notice">
          <CircleAlert size={18} />
          <div>
            <strong>Você está vendo uma demonstração.</strong>
            <span>
              {" "}
              Os dados abaixo são simulados e usam um contrato de exemplo. Eles não são uma análise
              do texto que você enviou.
            </span>
          </div>
        </div>
      )}
      <div className="document-bar">
        <div className="document-name">
          <span className="document-icon">
            <AlignLeft size={19} />
          </span>
          <div>
            <strong>{result.title}</strong>
            <span>
              {result.mode === "mock" ? "Exemplo ilustrativo" : "Análise gerada por IA"} · Linguagem
              simples
            </span>
          </div>
        </div>
        <button className="text-button" onClick={download}>
          <ArrowDownToLine size={16} />
          <span>Baixar resultado</span>
        </button>
      </div>
      <div className="dashboard-grid">
        <article className="result-card summary-card">
          <div className="card-heading">
            <span className="feature-icon blue">
              <AlignLeft size={21} />
            </span>
            <span className="small-tag">DIRETO AO PONTO</span>
          </div>
          <h2>
            Resumo Executivo <span className="title-tag">TL;DR</span>
          </h2>
          <p className="summary-text">{result.summary}</p>
          <div className="summary-bottom">
            <span>Sem letras miúdas. Sem complicação.</span>
            <button className="icon-button" aria-label="Copiar resumo" onClick={copy}>
              <Copy size={17} />
            </button>
          </div>
          <output className="copy-status">
            {copyState}
          </output>
        </article>
        <article className="result-card alerts-card">
          <div className="card-heading">
            <span className="feature-icon amber">
              <ShieldAlert size={21} />
            </span>
            <span className="alert-count">
              {result.alerts.length} ponto{result.alerts.length !== 1 ? "s" : ""} de atenção
            </span>
          </div>
          <h2>Radar de Pegadinhas</h2>
          <p className="card-subtitle">Um olhar atento antes de concordar.</p>
          <div className="alerts-list">
            {result.alerts.length === 0 ? (
              <p>Nenhum risco explícito identificado. Isso não garante ausência de riscos.</p>
            ) : (
              result.alerts.map((a, i) => (
                <div className={`alert-item ${a.severity}`} key={i}>
                  <TriangleAlert size={17} />
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
        <article className="result-card dictionary-card">
          <div className="card-heading">
            <span className="feature-icon blue">
              <BookOpen size={21} />
            </span>
            <span className="small-tag">DO JURIDIQUÊS AO PORTUGUÊS</span>
          </div>
          <h2>Dicionário Descomplicado</h2>
          <p className="card-subtitle">Palavras difíceis, explicações fáceis.</p>
          <dl>
            {result.dictionary.map((d) => (
              <div className="dictionary-row" key={d.term}>
                <dt>
                  {d.term}
                  <ArrowRight size={13} />
                </dt>
                <dd>{d.translation}</dd>
              </div>
            ))}
          </dl>
          {!result.dictionary.length && <p>Nenhum termo complexo identificado.</p>}
        </article>
        <article className="result-card steps-card">
          <div className="card-heading">
            <span className="feature-icon blue">
              <ListChecks size={21} />
            </span>
            <span className="small-tag">
              {checked.length} DE {result.steps.length} CONCLUÍDOS
            </span>
          </div>
          <h2>Próximos Passos</h2>
          <p className="card-subtitle">Da leitura à ação. Uma coisa de cada vez.</p>
          <div className="progress-track">
            <div
              style={{
                width: `${result.steps.length ? (checked.length / result.steps.length) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="steps-list">
            {result.steps.map((step, i) => (
              <label className={`step-item ${checked.includes(i) ? "completed" : ""}`} key={i}>
                <input
                  type="checkbox"
                  aria-label={step}
                  checked={checked.includes(i)}
                  onChange={() =>
                    setChecked((prev) =>
                      prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i],
                    )
                  }
                />
                <span className="custom-checkbox">
                  {checked.includes(i) && <Check size={13} />}
                </span>
                <span>{step}</span>
              </label>
            ))}
          </div>
          {!result.steps.length && <p>O documento não informa ações específicas.</p>}
          {result.steps.length > 0 && checked.length === result.steps.length && (
            <div className="all-done">
              <CheckCheck size={17} /> Checklist concluído. Tudo organizado!
            </div>
          )}
        </article>
      </div>
      <p className="legal-note">
        <ShieldAlert size={15} /> Uma ajuda para entender, não um parecer jurídico. Em caso de
        dúvida, consulte um profissional.
      </p>
    </section>
  );
}
