import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FileText,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { exampleDocument } from "../../shared/document";
import { AnalysisDashboard } from "../components/analysis-dashboard";
import { useAnalyzeDocument, useDocumentMode } from "../queries/documents";

const features = [
  {
    icon: AlignLeft,
    title: "Resumo Executivo",
    detail: "O essencial do documento, sem dar voltas.",
    label: "01",
  },
  {
    icon: ShieldAlert,
    title: "Radar de Pegadinhas",
    detail: "Riscos e letras miúdas que merecem atenção.",
    label: "02",
  },
  {
    icon: BookOpen,
    title: "Dicionário Simples",
    detail: "Termos complicados em palavras do dia a dia.",
    label: "03",
  },
  {
    icon: ListChecks,
    title: "Próximos Passos",
    detail: "Um checklist para saber o que fazer depois.",
    label: "04",
  },
];

function HelpDialog({ open, close }: { open: boolean; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="help-dialog"
      onClose={close}
      aria-labelledby="help-title"
    >
      <button className="dialog-close icon-button" onClick={close} aria-label="Fechar ajuda">
        <X size={20} />
      </button>
      <div className="feature-icon blue">
        <Lightbulb size={25} />
      </div>
      <h2 id="help-title">Burocracia não precisa ser um mistério.</h2>
      <p>Uma leitura mais simples começa em três passos.</p>
      <ol>
        <li>
          <span>1</span>
          <div>
            <strong>Cole o seu documento</strong>
            <p>
              Use um contrato, termo de uso ou edital. Remova dados pessoais e informações sensíveis
              antes de colar.
            </p>
          </div>
        </li>
        <li>
          <span>2</span>
          <div>
            <strong>Clique em Descomplicar Documento</strong>
            <p>
              No modo demonstração, você vê dados fixos de exemplo. Nenhum texto é enviado a um
              provedor de IA nesse modo.
            </p>
          </div>
        </li>
        <li>
          <span>3</span>
          <div>
            <strong>Entenda e organize suas ações</strong>
            <p>
              Leia os quatro painéis, marque o checklist e baixe o resultado para consultar depois.
            </p>
          </div>
        </li>
      </ol>
      <div className="help-warning">
        <ShieldCheck size={19} />
        <span>
          Não salvamos documentos no banco. Se a IA for ativada, o texto será enviado ao provedor
          configurado. Esta ferramenta não substitui orientação jurídica.
        </span>
      </div>
      <button className="primary-button full-width" onClick={close}>
        Entendi, vamos descomplicar <ArrowRight size={18} />
      </button>
    </dialog>
  );
}

export default function Translator() {
  const [text, setText] = useState("");
  const [help, setHelp] = useState(false);
  const [validation, setValidation] = useState("");
  const editor = useRef<HTMLTextAreaElement>(null);
  const analyze = useAnalyzeDocument();
  const modeQuery = useDocumentMode();
  const result = analyze.data;
  const isMock = modeQuery.data?.mode !== "live";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  function reset() {
    analyze.reset();
    setText("");
    setValidation("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function useExample() {
    setText(exampleDocument);
    setValidation("");
    analyze.reset();
    requestAnimationFrame(() => editor.current?.focus());
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 20) {
      setValidation("Cole um documento com pelo menos 20 caracteres para continuar.");
      editor.current?.focus();
      return;
    }
    setValidation("");
    analyze.mutate({ text }, { onSuccess: () => window.scrollTo({ top: 0, behavior: "smooth" }) });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Tradutor de Burocracia, início">
          <span className="brand-mark">
            <FileText size={24} />
            <span className="brand-spark">
              <Sparkles size={10} />
            </span>
          </span>
          <span>
            tradutor de
            <br />
            <strong>
              burocracia<span className="brand-dot">.</span>
            </strong>
          </span>
        </a>
        <div className="nav-caption">SEU ESPAÇO</div>
        <nav aria-label="Menu principal">
          <button
            className="nav-item active"
            onClick={() => {
              if (result) reset();
              else editor.current?.focus();
            }}
          >
            <WandSparkles size={19} /> Descomplicar <span className="active-dot" />
          </button>
          <button className="nav-item" onClick={() => setHelp(true)}>
            <CircleHelp size={19} /> Como funciona <ChevronRight size={14} />
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Lightbulb size={19} />
            </span>
            <h3>Entender é o primeiro passo.</h3>
            <p>Você não precisa ser advogado para saber o que está assinando.</p>
            <button onClick={() => setHelp(true)}>
              Conheça a ferramenta <ArrowRight size={14} />
            </button>
          </div>
          <div className="sidebar-footer">
            <ShieldCheck size={16} />
            <span>Mais clareza. Menos dúvidas.</span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Seu espaço de clareza</span>
            <ChevronRight size={14} />
            <strong>{result ? "Resultado" : "Novo documento"}</strong>
          </div>
          <div className="topbar-actions">
            <span className="mode-pill">
              <span />
              {modeQuery.isLoading
                ? "Verificando modo..."
                : modeQuery.isError
                  ? "Modo indisponível"
                  : isMock
                    ? "Modo demonstração"
                    : "IA conectada"}
            </span>
            <button
              className="help-button icon-button"
              aria-label="Abrir ajuda"
              onClick={() => setHelp(true)}
            >
              <CircleHelp size={20} />
            </button>
          </div>
        </header>
        <main>
          {result ? (
            <AnalysisDashboard result={result} onReset={reset} />
          ) : (
            <div className="home-content reveal">
              <section className="hero">
                <div className="hero-eyebrow">
                  <span>
                    <Sparkles size={14} />
                  </span>{" "}
                  TRADUZA O COMPLICADO. ENTENDA O IMPORTANTE.
                </div>
                <h1>
                  Menos juridiquês.
                  <br />
                  <span>Mais clareza.</span>
                </h1>
                <p>
                  Contratos, termos e editais em uma linguagem que faz sentido.
                  <br className="desktop-break" /> Entenda o que está escrito antes de dar o próximo
                  passo.
                </p>
                <div className="document-types">
                  <span>
                    <FileText size={14} /> Contratos
                  </span>
                  <i />
                  <span>
                    <FileCheck2 size={14} /> Termos de uso
                  </span>
                  <i />
                  <span>
                    <BookOpen size={14} /> Editais
                  </span>
                </div>
              </section>
              <section className="editor-section" aria-label="Entrada do documento">
                <div className="editor-topline">
                  <label htmlFor="document-text">
                    <FileText size={17} /> Seu documento
                  </label>
                  <button
                    className="text-button example-button"
                    onClick={useExample}
                    disabled={analyze.isPending}
                  >
                    <Sparkles size={14} /> Experimentar com um exemplo <ArrowRight size={14} />
                  </button>
                </div>
                <form
                  className={`editor-card ${analyze.isPending ? "is-loading" : ""}`}
                  onSubmit={submit}
                >
                  <div className="textarea-wrap">
                    <textarea
                      id="document-text"
                        aria-label="Seu documento"
                      ref={editor}
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        setValidation("");
                      }}
                      maxLength={40000}
                      disabled={analyze.isPending}
                      placeholder="Cole aqui o seu contrato, termo de uso ou documento complexo..."
                      aria-describedby="editor-privacy editor-error"
                    />
                    <div className="editor-count">
                      <span>{words.toLocaleString("pt-BR")} palavras</span>
                      <span>{text.length.toLocaleString("pt-BR")} / 40.000 caracteres</span>
                    </div>
                  </div>
                  <div className="editor-action-row">
                    <div className="editor-hint">
                      <LockKeyhole size={16} />
                      <span id="editor-privacy">
                        {isMock
                          ? "Seu texto não é salvo. Sem envio à IA na demo."
                          : "Seu texto não é salvo. A IA receberá o conteúdo."}
                      </span>
                    </div>
                    <button className="primary-button" type="submit" disabled={analyze.isPending}>
                      {analyze.isPending ? (
                        <LoaderCircle size={18} className="spin" />
                      ) : (
                        <WandSparkles size={18} />
                      )}
                      <span>
                        {analyze.isPending
                          ? "Analisando o juridiquês..."
                          : "Descomplicar Documento"}
                      </span>
                      {!analyze.isPending && <ArrowRight size={17} />}
                    </button>
                  </div>
                </form>
                <div id="editor-error" className="editor-error" role="alert">
                  {validation || (analyze.isError ? analyze.error.message : "")}
                </div>
                <div className="under-editor" aria-live="polite">
                  {analyze.isPending ? (
                    <>
                      <LoaderCircle size={13} className="spin" /> Organizando as informações para
                      você...
                    </>
                  ) : (
                    <>
                      <span className="tiny-check">
                        <Check size={11} />
                      </span>{" "}
                      {isMock
                        ? "Uma prévia do que a IA pode fazer. Resultados simulados nesta versão."
                        : "Simplificação com IA. Confira as informações no documento original."}
                    </>
                  )}
                </div>
              </section>
              <section className="features-section" aria-label="O que você vai receber">
                <div className="section-divider">
                  <span />
                  <p>UM DOCUMENTO. QUATRO FORMAS DE ENTENDER.</p>
                  <span />
                </div>
                <div className="feature-grid">
                  {features.map((f) => (
                    <article className="feature-card" key={f.label}>
                      <div className="feature-top">
                        <span className={`feature-icon ${f.label === "02" ? "amber" : "blue"}`}>
                          <f.icon size={20} />
                        </span>
                        <span className="feature-number">{f.label}</span>
                      </div>
                      <h2>{f.title}</h2>
                      <p>{f.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
              <div className="bottom-message">
                <MessageCircle size={15} />
                <span>Feito para pessoas. Não para especialistas em letras miúdas.</span>
              </div>
            </div>
          )}
        </main>
        <footer className="workspace-footer">
          <span>Tradutor de Burocracia</span>
          <span>Clareza para decidir melhor.</span>
          <button onClick={() => setHelp(true)}>
            Sobre a ferramenta <ArrowRight size={12} />
          </button>
        </footer>
      </div>
      <HelpDialog open={help} close={() => setHelp(false)} />
    </div>
  );
}
