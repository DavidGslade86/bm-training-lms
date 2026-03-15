import { Nav, Blocks } from "./Shared";
import { GT } from "./Glossary";

export default function ContentCard({ data }) {
  return (
    <div>
      <div className="mb-1 text-2xl font-bold text-brand-gray-dk font-heading">{data.title}</div>
      <div className="text-sm mb-5 text-brand-tl">{data.subtitle}</div>
      {data.intro && (
        <p className="text-sm leading-relaxed mb-5 text-brand-tm"><GT t={data.intro}/></p>
      )}
      <Blocks blocks={data.blocks}/>
      <Nav ok={true}/>
    </div>
  );
}
