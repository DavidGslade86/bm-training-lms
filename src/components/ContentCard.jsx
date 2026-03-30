import { useContext } from "react";
import { Ctx } from "../state";
import { Nav, Blocks, ET } from "./Shared";
import { GT } from "./Glossary";

export default function ContentCard({ data, cardId }) {
  const { editMode } = useContext(Ctx);

  // In edit mode use <div> wrappers so ET's textarea/input are valid HTML
  const TitleTag  = editMode ? "div" : "div";  // always div
  const SubTag    = editMode ? "div" : "div";
  const IntroTag  = editMode ? "div" : "p";

  return (
    <div>
      <TitleTag className="mb-1 text-2xl font-bold text-brand-gray-dk font-heading">
        {editMode
          ? <ET cardId={cardId} path="data.title" value={data.title}>{data.title}</ET>
          : data.title}
      </TitleTag>
      <SubTag className="text-sm mb-5 text-brand-tl">
        {editMode
          ? <ET cardId={cardId} path="data.subtitle" value={data.subtitle}>{data.subtitle}</ET>
          : data.subtitle}
      </SubTag>
      {data.intro && (
        <IntroTag className="text-sm leading-relaxed mb-5 text-brand-tm">
          {editMode
            ? <ET cardId={cardId} path="data.intro" value={data.intro} multiline><GT t={data.intro}/></ET>
            : <GT t={data.intro}/>}
        </IntroTag>
      )}
      <Blocks blocks={data.blocks} cardId={cardId}/>
      <Nav ok={true}/>
    </div>
  );
}
