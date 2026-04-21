import { useState, useEffect } from "react";

/* ═══ THEME ═══ */
const T = {
  bg:"linear-gradient(155deg,#faf5ea 0%,#f2ead6 35%,#e8dfc8 100%)",
  text:"#3a3226",tm:"#7a6e5a",accent:"#c9a84c",card:"rgba(255,255,255,0.55)",cb:"rgba(58,50,38,0.1)",
  nav:"#1b296e",sb:"#0176d3",sbd:"#014486",sbl:"#e8f4fd",sw:"#ffffff",
  sbo:"#d8dde6",sbol:"#e5e5e5",st:"#181818",stm:"#706e6b",sg:"#2e844a",ssr:"#f0f8ff",
  d:"'Georgia','Times New Roman',serif",s:"'Salesforce Sans','Segoe UI',sans-serif",m:"'SF Mono','Courier New',monospace",
};

/* ═══ DATA ═══ */
const OBJ={Lead:{c:"#C97B3A",f:["First Name","Last Name","Employer","Phone","Email","Lead Status","Created Date"]},Account:{c:"#4A7FA8",f:["Account Name","VCF #","Status","Sub-Status","Primary Contact","Type","Account Record Type","Created Date","Account Owner","Last Activity","Victim State/Province","Last Modified Date"]},"CMS Claim Submission":{c:"#7AAE5E",f:["Claim No","Claim Status","Submitted Date","Claim Type","Account Name"]},Contact:{c:"#D88896",f:["First Name","Last Name","Email","Phone","Role"]}};
const CATS=[{n:"Recently Used",t:["Accounts with CMS Claim Submissions","Accounts with Supporting Documents"]},{n:"All",t:null},{n:"Accounts & Contacts",t:["Accounts","Accounts and Client Journey","Contacts & Accounts","Accounts with Partners","Accounts with Contact Roles","Accounts with CMS Claim Submissions","Accounts with Supporting Documents"]},{n:"Leads",t:["Leads","Leads with converted lead information"]},{n:"Customer Support Reports",t:["Cases"]},{n:"Activities",t:["Activities"]}];
const RTS=[{n:"Accounts",cat:"Standard",o:["Account"]},{n:"Accounts and Client Journey",cat:"Standard",o:["Account"]},{n:"Contacts & Accounts",cat:"Standard",o:["Contact","Account"]},{n:"Accounts with Partners",cat:"Standard",o:["Account"]},{n:"Accounts with Contact Roles",cat:"Standard",o:["Account","Contact"]},{n:"Accounts with CMS Claim Submissions",cat:"Custom",o:["Account","CMS Claim Submission"]},{n:"Accounts with Supporting Documents",cat:"Standard",o:["Account"]},{n:"Leads",cat:"Standard",o:["Lead"]},{n:"Leads with converted lead information",cat:"Standard",o:["Lead"]},{n:"Cases",cat:"Standard",o:["Account"]}];
const EX=[
  {id:1,title:"Single Object Report",q:"Find all Leads where the Employer is FDNY.",why:"All the data we need — Employer — lives on the Lead object. One object means a simple, single-object report type.",rt:"Leads",cols:["First Name","Last Name","Employer","Phone","Lead Status"],
  filters:[{field:"Employer",op:"equals",val:"FDNY",obj:"Lead"}],sm:"All Leads",grp:null,
  rows:[{a:"Mike",b:"Rivera",c:"FDNY",d:"555-0301",e:"New"},{a:"Sarah",b:"Chen",c:"FDNY",d:"555-0302",e:"Contacted"},{a:"Tom",b:"Walsh",c:"FDNY",d:"555-0303",e:"New"},{a:"Ana",b:"Gomez",c:"FDNY",d:"555-0304",e:"Working"}],
  tryIt:"Open the Reports tab → New Report → select 'Leads' from the Leads category → Start Report → Change \"Show Me\" to \"All Leads\" → Add an Employer filter set to equals FDNY → Save & Run."},
  {id:2,title:"Cross-Object Report",q:"Find all Accounts with a Status of 'Claim Submission' where the claim was submitted before January 1.",why:"Status lives on Account, but Submitted Date lives on CMS Claim Submission. Data from two objects means we need the combined report type.",rt:"Accounts with CMS Claim Submissions",cols:["Account Name","VCF #","Status","Claim No","Submitted Date"],
  filters:[{field:"Status",op:"equals",val:"Claim Submission",obj:"Account"},{field:"Submitted Date",op:"less or equal",val:"1/1/2026",obj:"CMS Claim Submission"}],sm:"All Accounts",grp:null,
  rows:[{a:"John Doe",b:"VCF0001234",c:"Claim Submission",d:"CLAIM-4401",e:"11/15/2025"},{a:"Maria Santos",b:"VCF0002891",c:"Claim Submission",d:"CLAIM-4520",e:"10/22/2025"},{a:"James Lee",b:"VCF0003102",c:"Claim Submission",d:"CLAIM-4611",e:"12/03/2025"}],
  tryIt:"Open the Reports tab → New Report → search for 'CMS Claim' or browse Accounts & Contacts → select 'Accounts with CMS Claim Submissions' → Start Report → Change \"Show Me\" to \"All Accounts\" → Add Status filter = Claim Submission → Add Submitted Date filter ≤ 1/1/2026 → Save & Run."},
  {id:3,title:"Refining & Grouping",q:"Find all living clients with Status 'Claim Submission' and a submitted date before January 1, grouped by Status.",why:"This builds on Exercise 2 by adding filters that exclude non-client records and narrowing to living clients, plus grouping to organize the results.",rt:"Accounts with CMS Claim Submissions",cols:["Account Name","VCF #","Type","Account Record Type","Claim No","Submitted Date"],
  prefilled:[{field:"Status",op:"equals",val:"Claim Submission",obj:"Account"},{field:"Submitted Date",op:"less or equal",val:"1/1/2026",obj:"CMS Claim Submission"}],
  filters:[{field:"Type",op:"equals",val:"Client",obj:"Account"},{field:"Account Record Type",op:"equals",val:"VCF Victim",obj:"Account",picklist:["VCF Victim","VCF Courtesy","VCF Estate"]}],
  sm:"All Accounts",grp:"Status",
  groups:[{g:"Claim Submission",ct:5,rows:[{a:"John Doe",b:"VCF0001234",c:"Client",d:"VCF Victim",e:"CLAIM-4401",f:"11/15/2025"},{a:"Maria Santos",b:"VCF0002891",c:"Client",d:"VCF Victim",e:"CLAIM-4520",f:"10/22/2025"}]}],
  tryIt:"Start from your Exercise 2 report → add Type filter = Client → add Account Record Type filter = VCF Victim → switch to the Outline tab → drag 'Status' into the Group Rows area → Save & Run."},
];

/* ═══ PULSE ANIMATION (CSS injected once) ═══ */
const PULSE_CSS = `
@keyframes sfPulse {
  0% { box-shadow: 0 0 0 0 rgba(1,118,211,0.45); }
  70% { box-shadow: 0 0 0 8px rgba(1,118,211,0); }
  100% { box-shadow: 0 0 0 0 rgba(1,118,211,0); }
}
@keyframes sfGlowBorder {
  0%,100% { border-color: rgba(1,118,211,0.5); }
  50% { border-color: rgba(1,118,211,1); }
}
`;
function InjectCSS() {
  useEffect(() => {
    if (document.getElementById("sf-pulse-css")) return;
    const s = document.createElement("style");
    s.id = "sf-pulse-css";
    s.textContent = PULSE_CSS;
    document.head.appendChild(s);
  }, []);
  return null;
}

/* ═══ HELPERS ═══ */
function Badge({children,color=T.sb}){return <span style={{display:"inline-block",background:color,color:"#fff",padding:"2px 10px",borderRadius:10,fontSize:11,fontFamily:T.s,fontWeight:600}}>{children}</span>;}
function Callout({children,icon="💡"}){return <div style={{background:"#fdf8e8",border:`1px solid ${T.accent}`,borderRadius:10,padding:"12px 16px",margin:"12px 0",fontFamily:T.d,fontSize:13.5,color:T.text,lineHeight:1.5,display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:18,flexShrink:0}}>{icon}</span><div>{children}</div></div>;}
function Pill({name}){const o=OBJ[name];return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:o?.c||"#888",color:"#fff",padding:"3px 10px",borderRadius:12,fontSize:11,fontFamily:T.s,fontWeight:600}}><span style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.5)"}}/>{name}</span>;}

// Pulsing wrapper for interactive elements
function Pulse({children,active=true,style={}}){
  return <div style={{...style,animation:active?"sfPulse 2s infinite":"none",borderRadius:style.borderRadius||4}}>{children}</div>;
}

/* ═══ REPORTS TAB ═══ */
function ReportsTab({onNew}){
  const reps=[{n:"Client Count",f:"Claims",b:"Laura Pena",d:"9/14/2023"},{n:"FA- Ready for Attorney Review",f:"Olivia",b:"Olivia Bustos",d:"4/10/2023"},{n:"My Open Tasks | Next 7 Days",f:"Public Reports",b:"Data API",d:"10/31/2017"},{n:"WTCHP Open Cases",f:"Public Reports",b:"Laura Pena",d:"8/20/2020"}];
  return <div style={{background:T.sw,borderRadius:8,border:`1px solid ${T.sbo}`,overflow:"hidden"}}>
    <div style={{background:T.nav,padding:"8px 16px",display:"flex",gap:20,fontFamily:T.s,fontSize:12,color:"rgba(255,255,255,0.7)"}}>
      <span>Home</span><span>Leads</span><span>Accounts</span><span>Calls</span>
      <span style={{color:"#fff",fontWeight:700,borderBottom:"2px solid #fff",paddingBottom:4}}>Reports</span>
    </div>
    <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:`1px solid ${T.sbo}`}}>
      <div><div style={{fontFamily:T.s,fontSize:11,color:T.stm}}>Reports</div><div style={{fontFamily:T.s,fontSize:18,fontWeight:700,color:T.st}}>Recent</div><div style={{fontFamily:T.s,fontSize:11,color:T.stm}}>{reps.length} items</div></div>
      <div style={{display:"flex",gap:8}}>
        <div style={{border:`1px solid ${T.sbo}`,borderRadius:4,padding:"6px 12px",fontFamily:T.s,fontSize:12,color:T.stm}}>Search recent reports...</div>
        <Pulse active style={{borderRadius:4}}>
          <button onClick={onNew} style={{background:"#fff",border:`2px solid ${T.sb}`,color:T.sb,padding:"6px 16px",borderRadius:4,fontFamily:T.s,fontSize:12,fontWeight:600,cursor:"pointer",animation:"sfGlowBorder 2s infinite"}}>New Report</button>
        </Pulse>
      </div>
    </div>
    <div style={{display:"flex"}}>
      <div style={{width:140,borderRight:`1px solid ${T.sbo}`,padding:"10px 0",flexShrink:0}}>
        <div style={{padding:"0 12px",fontFamily:T.s,fontSize:10,fontWeight:700,color:T.stm,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>Reports</div>
        {["Recent","Created by Me","Private Reports","Public Reports","All Reports"].map((x,i)=><div key={x} style={{padding:"5px 12px",fontFamily:T.s,fontSize:12,color:i===0?T.sb:T.st,fontWeight:i===0?600:400,borderLeft:i===0?`3px solid ${T.sb}`:"3px solid transparent"}}>{x}</div>)}
        <div style={{padding:"10px 12px 0",fontFamily:T.s,fontSize:10,fontWeight:700,color:T.stm,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>Folders</div>
        {["All Folders","Created by Me","Shared with Me"].map(x=><div key={x} style={{padding:"5px 12px",fontFamily:T.s,fontSize:12,color:T.st}}>{x}</div>)}
      </div>
      <div style={{flex:1,overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:T.s,fontSize:12}}>
        <thead><tr style={{borderBottom:`2px solid ${T.sbo}`}}>{["Report Name","Folder","Created By","Created On"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:11,fontWeight:700,color:T.stm,whiteSpace:"nowrap"}}>{h} ▾</th>)}</tr></thead>
        <tbody>{reps.map((r,i)=><tr key={i} style={{borderBottom:`1px solid ${T.sbol}`}}><td style={{padding:"8px 12px",color:T.sb,fontWeight:500}}>{r.n}</td><td style={{padding:"8px 12px",color:T.sb}}>{r.f}</td><td style={{padding:"8px 12px",color:T.sb}}>{r.b}</td><td style={{padding:"8px 12px",color:T.st}}>{r.d}</td></tr>)}</tbody>
      </table></div>
    </div>
  </div>;
}

/* ═══ CREATE REPORT MODAL ═══ */
function CreateReport({ex,sel,onSel,onStart,hint}){
  const[cat,setCat]=useState("All");
  const[sf,setSf]=useState(false);
  const vis=cat==="All"?RTS:RTS.filter(r=>{const c=CATS.find(x=>x.n===cat);return c?.t?.includes(r.n);});
  const srt=RTS.find(r=>r.n===sel);
  const ok=sel===ex.rt;
  return <div style={{background:T.sw,borderRadius:8,border:`1px solid ${T.sbo}`,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.15)"}}>
    <div style={{padding:"16px 20px",textAlign:"center",borderBottom:`1px solid ${T.sbo}`,fontFamily:T.s,fontSize:18,color:T.st,position:"relative"}}>Create Report<span style={{position:"absolute",right:20,top:16,fontSize:20,color:T.stm,cursor:"pointer"}}>×</span></div>
    <div style={{display:"flex",minHeight:320}}>
      <div style={{width:170,borderRight:`1px solid ${T.sbo}`,padding:"12px 0",flexShrink:0}}>
        <div style={{padding:"0 16px 8px",fontFamily:T.s,fontSize:13,fontWeight:700,color:T.st}}>Category</div>
        {CATS.map(c=><div key={c.n} onClick={()=>setCat(c.n)} style={{padding:"6px 16px",fontFamily:T.s,fontSize:13,cursor:"pointer",color:cat===c.n?T.sb:T.st,fontWeight:cat===c.n?600:400,background:cat===c.n?"#e8f4fd":"transparent",borderLeft:cat===c.n?`3px solid ${T.sb}`:"3px solid transparent"}}>{c.n}</div>)}
      </div>
      <div style={{flex:1,borderRight:sel?`1px solid ${T.sbo}`:"none",padding:"12px 16px"}}>
        <div style={{fontFamily:T.s,fontSize:15,color:T.st,marginBottom:10}}>Select a Report Type</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{flex:1,border:`1px solid ${T.sbo}`,borderRadius:4,padding:"7px 12px",fontFamily:T.s,fontSize:13,color:T.stm}}>🔍 Search Report Types...</div>
          <div style={{border:`1px solid ${T.sb}`,borderRadius:4,padding:"7px 14px",fontFamily:T.s,fontSize:12,color:T.sb,fontWeight:500,whiteSpace:"nowrap"}}>🔽 Filter report types (0)</div>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:T.s,fontSize:13}}>
          <thead><tr style={{borderBottom:`1px solid ${T.sbo}`}}><th style={{textAlign:"left",padding:"6px 8px",fontSize:12,fontWeight:700,color:T.stm}}>Report Type Name</th><th style={{textAlign:"left",padding:"6px 8px",fontSize:12,fontWeight:700,color:T.stm}}>Category</th></tr></thead>
          <tbody>{vis.map(rt=>{
            const isTarget=rt.n===ex.rt;
            const isSel=sel===rt.n;
            return <tr key={rt.n} onClick={()=>onSel(rt.n)} style={{
              borderBottom:`1px solid ${T.sbol}`,cursor:"pointer",
              background:isSel?T.ssr:"transparent",
              outline:isTarget&&!sel&&hint?`2px solid ${T.sb}`:"none",
              animation:isTarget&&!sel&&hint?"sfGlowBorder 2s infinite":"none",
            }}><td style={{padding:"8px",color:T.st,fontWeight:isTarget&&!sel?600:400}}>{rt.n}</td><td style={{padding:"8px",color:T.stm}}>{rt.cat}</td></tr>;
          })}</tbody>
        </table>
      </div>
      {sel && <div style={{width:240,padding:"12px 16px",flexShrink:0}}>
        <div style={{fontFamily:T.s,fontSize:14,fontWeight:700,color:T.st,marginBottom:12}}>Details</div>
        <div style={{fontFamily:T.s,fontSize:14,fontWeight:600,color:T.st,marginBottom:4}}>{sel}</div>
        <div style={{fontFamily:T.s,fontSize:11,color:T.stm,marginBottom:12}}>{srt?.cat} Report Type</div>
        <Pulse active={ok} style={{borderRadius:4,display:"inline-block"}}>
          <button onClick={onStart} disabled={!ok} style={{background:ok?T.sb:"#b0b0b0",color:"#fff",border:"none",padding:"8px 20px",borderRadius:4,fontFamily:T.s,fontSize:13,fontWeight:600,cursor:ok?"pointer":"default",marginBottom:14}}>Start Report</button>
        </Pulse>
        <div style={{display:"flex",borderBottom:`2px solid ${T.sbo}`,marginBottom:10}}>
          <button onClick={()=>setSf(false)} style={{background:"none",border:"none",padding:"6px 12px",fontFamily:T.s,fontSize:12,fontWeight:600,cursor:"pointer",color:!sf?T.sb:T.stm,borderBottom:!sf?`2px solid ${T.sb}`:"2px solid transparent",marginBottom:-2}}>ⓘ Details</button>
          <button onClick={()=>setSf(true)} style={{background:"none",border:"none",padding:"6px 12px",fontFamily:T.s,fontSize:12,fontWeight:600,cursor:"pointer",color:sf?T.sb:T.stm,borderBottom:sf?`2px solid ${T.sb}`:"2px solid transparent",marginBottom:-2}}>☰ Fields</button>
        </div>
        {!sf?<div style={{fontFamily:T.s,fontSize:12}}><div style={{fontWeight:700,color:T.st,marginBottom:6}}>Objects Used in Report Type</div>{srt?.o.map(o=><div key={o} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{width:8,height:8,borderRadius:2,background:OBJ[o]?.c||"#888"}}/><span style={{color:T.sb}}>{o}</span></div>)}</div>
        :<div style={{fontFamily:T.s,fontSize:12}}>
          <div style={{border:`1px solid ${T.sbo}`,borderRadius:4,padding:"6px 10px",fontSize:12,color:T.stm,marginBottom:8}}>🔍 Quick Lookup</div>
          {srt?.o.map(on=><div key={on} style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:700,color:T.stm,marginBottom:4}}>{on} Fields</div>{(OBJ[on]?.f||[]).slice(0,5).map(f=><div key={f} style={{padding:"2px 0",fontSize:12,color:T.st}}><span style={{color:T.stm,marginRight:6}}>A</span>{f}</div>)}<div style={{fontSize:11,color:T.stm,fontStyle:"italic"}}>+ more...</div></div>)}
        </div>}
      </div>}
    </div>
    {sel&&!ok&&<div style={{padding:"0 20px 16px"}}><Callout icon="🤔">Think about which objects hold the data you need. {ex.filters.some(f=>f.obj!==ex.filters[0].obj)?"Your filters reference fields from different objects — look for a report type that includes both.":"All your data lives on one object — find its report type."}</Callout></div>}
    {ok&&<div style={{padding:"0 20px 16px"}}><Callout icon="✓"><strong>Correct!</strong> {ex.why} Check the <strong>Fields</strong> tab to confirm, then press <strong>Start Report</strong>.</Callout></div>}
  </div>;
}

/* ═══ INTERACTIVE REPORT BUILDER ═══ */
function Builder({ex,onRun}){
  const[tab,setTab]=useState("filters");
  const[fp,setFp]=useState(false);
  const[added,setAdded]=useState([]);
  const[showPop,setShowPop]=useState(false);
  const[popStep,setPopStep]=useState(0);
  const[popFilter,setPopFilter]=useState(null);
  const[picklistSel,setPicklistSel]=useState(null);
  const[grpAdded,setGrpAdded]=useState(false);
  const[showGrpPick,setShowGrpPick]=useState(false);
  const multi=ex.rt.includes("with");
  const prefilled=ex.prefilled||[];
  const allFiltersDone=added.length===ex.filters.length;
  const allDone=allFiltersDone&&(!ex.grp||grpAdded);
  const nextFilter=ex.filters[added.length];
  const grpOptions=["Status","Sub-Status","Type","Account Record Type","Account Owner"];

  function startAddFilter(){
    if(allFiltersDone)return;
    setPopFilter(added.length);
    setPopStep(0);
    setPicklistSel(null);
    setShowPop(true);
  }
  function confirmFilter(){
    setAdded(prev=>[...prev,popFilter]);
    setShowPop(false);
    setPopFilter(null);
    setPopStep(0);
    setPicklistSel(null);
  }

  return <div style={{background:T.sw,borderRadius:8,border:`1px solid ${T.sbo}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",borderBottom:`1px solid ${T.sbo}`,background:"#fafafa",borderRadius:"8px 8px 0 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:T.s}}>
        <span style={{fontSize:13,color:T.stm}}>New Report ✏️</span>
        <span style={{background:"#eee",padding:"4px 12px",borderRadius:4,fontSize:13,fontWeight:600,color:T.st}}>{ex.rt}</span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Pulse active={allDone} style={{borderRadius:4,display:"inline-block"}}>
          <button onClick={allDone?onRun:undefined} style={{
            background:allDone?T.sb:"#ccc",color:"#fff",border:"none",padding:"6px 16px",
            borderRadius:4,fontFamily:T.s,fontSize:12,fontWeight:600,cursor:allDone?"pointer":"default",
          }}>Save & Run</button>
        </Pulse>
        <button style={{background:"#fff",color:T.st,border:`1px solid ${T.sbo}`,padding:"6px 16px",borderRadius:4,fontFamily:T.s,fontSize:12}}>Save</button>
      </div>
    </div>

    <div style={{display:"flex",position:"relative",minHeight:360}}>
      {/* Fields toggle */}
      <div onClick={()=>setFp(!fp)} style={{width:24,background:"#f5f5f5",borderRight:`1px solid ${T.sbo}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",writingMode:"vertical-lr",fontFamily:T.s,fontSize:11,color:T.sb,fontWeight:600,letterSpacing:1,zIndex:2}}>Fields {fp?"◂":"▸"}</div>
      {fp&&<div style={{position:"absolute",left:24,top:0,bottom:0,width:200,borderRight:`1px solid ${T.sbo}`,padding:12,overflowY:"auto",background:"#fafafa",zIndex:3,boxShadow:"4px 0 12px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:T.s,fontSize:12,fontWeight:700,color:T.st}}>Fields</span>
          <span onClick={()=>setFp(false)} style={{fontSize:14,color:T.stm,cursor:"pointer"}}>×</span>
        </div>
        <div style={{border:`1px solid ${T.sbo}`,borderRadius:4,padding:"6px 8px",fontFamily:T.s,fontSize:11,color:T.stm,marginBottom:10,background:"#fff"}}>🔍 Search all fields...</div>
        {(multi?["Account","CMS Claim Submission"]:[ex.filters[0].obj]).map(on=><div key={on} style={{marginBottom:10}}>
          <div style={{fontFamily:T.s,fontSize:11,fontWeight:700,color:T.stm,marginBottom:4}}>{on} ({OBJ[on]?.f.length})</div>
          {(OBJ[on]?.f||[]).map(f=><div key={f} style={{padding:"3px 0",fontFamily:T.s,fontSize:11.5,color:T.st}}><span style={{color:T.stm,marginRight:4}}>A</span>{f}</div>)}
        </div>)}
      </div>}

      {/* Outline / Filters panel */}
      <div style={{width:230,borderRight:`1px solid ${T.sbo}`,flexShrink:0}}>
        <div style={{display:"flex",borderBottom:`1px solid ${T.sbo}`}}>
          {["outline","filters"].map(t=>{
            const needsGrp=ex.grp&&allFiltersDone&&!grpAdded&&t==="outline";
            return <button key={t} onClick={()=>setTab(t)} style={{
              flex:1,padding:"10px 8px",background:"none",border:"none",fontFamily:T.s,fontSize:12,fontWeight:600,cursor:"pointer",
              color:tab===t?T.st:T.stm,borderBottom:tab===t?`2px solid ${T.sb}`:"2px solid transparent",
              display:"flex",alignItems:"center",justifyContent:"center",gap:4,
              animation:needsGrp?"sfGlowBorder 2s infinite":"none",
              borderColor:needsGrp&&tab!==t?T.sb:undefined,
            }}>
              {t==="outline"?"☰ Outline":"🔽 Filters"}
              {t==="filters"&&<span style={{background:T.sb,color:"#fff",borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{prefilled.length+added.length}</span>}
              {needsGrp&&tab!==t&&<span style={{fontSize:10,color:T.sb}}>!</span>}
            </button>;
          })}
        </div>
        <div style={{padding:12}}>
          {tab==="filters"&&<>
            <div style={{fontFamily:T.s,fontSize:12,fontWeight:700,color:T.st,marginBottom:8}}>Filters</div>
            {/* Add filter button */}
            <Pulse active={!allFiltersDone&&!showPop} style={{borderRadius:4,marginBottom:10}}>
              <div onClick={startAddFilter} style={{
                border:`2px solid ${!allFiltersDone&&!showPop?T.sb:T.sbo}`,borderRadius:4,padding:"8px 10px",
                fontFamily:T.s,fontSize:12,color:!allFiltersDone?T.sb:T.stm,
                cursor:!allFiltersDone?"pointer":"default",fontWeight:!allFiltersDone?600:400,
                background:!allFiltersDone?"#f8fbff":"#fff",
              }}>
                {!allFiltersDone ? `+ Add filter (${ex.filters.length - added.length} remaining)` : "All filters added ✓"}
              </div>
            </Pulse>

            {/* Filter popover */}
            {showPop && nextFilter && <div style={{
              border:`2px solid ${T.sb}`,borderRadius:8,padding:14,marginBottom:10,
              background:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
            }}>
              <div style={{fontFamily:T.s,fontSize:11,fontWeight:700,color:T.stm,textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>Add Filter</div>
              {/* Field */}
              <div style={{marginBottom:8}}>
                <div style={{fontFamily:T.s,fontSize:11,color:T.stm,marginBottom:4}}>Field</div>
                {popStep===0 ? (
                  <Pulse active style={{borderRadius:4}}>
                    <div onClick={()=>setPopStep(1)} style={{border:`2px solid ${T.sb}`,borderRadius:4,padding:"6px 10px",fontFamily:T.s,fontSize:12,cursor:"pointer",background:"#f8fbff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:T.sb,fontWeight:600}}>Select: {nextFilter.field}</span>
                      <span style={{fontSize:10,color:T.stm}}>from {nextFilter.obj}</span>
                    </div>
                  </Pulse>
                ) : (
                  <div style={{border:`1px solid ${T.sg}`,borderRadius:4,padding:"6px 10px",fontFamily:T.s,fontSize:12,background:"#f0f8f0",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:2,background:OBJ[nextFilter.obj]?.c||"#888"}}/>
                    <span style={{fontWeight:600}}>{nextFilter.field}</span>
                    <span style={{fontSize:10,color:T.stm,marginLeft:"auto"}}>{nextFilter.obj}</span>
                  </div>
                )}
              </div>
              {/* Operator */}
              {popStep>=1&&<div style={{marginBottom:8}}>
                <div style={{fontFamily:T.s,fontSize:11,color:T.stm,marginBottom:4}}>Operator</div>
                {popStep===1 ? (
                  <Pulse active style={{borderRadius:4}}>
                    <div onClick={()=>setPopStep(2)} style={{border:`2px solid ${T.sb}`,borderRadius:4,padding:"6px 10px",fontFamily:T.s,fontSize:12,cursor:"pointer",background:"#f8fbff",color:T.sb,fontWeight:600}}>{nextFilter.op}</div>
                  </Pulse>
                ) : (
                  <div style={{border:`1px solid ${T.sg}`,borderRadius:4,padding:"6px 10px",fontFamily:T.s,fontSize:12,background:"#f0f8f0",fontWeight:600}}>{nextFilter.op}</div>
                )}
              </div>}
              {/* Value — picklist or plain */}
              {popStep>=2&&<div style={{marginBottom:10}}>
                <div style={{fontFamily:T.s,fontSize:11,color:T.stm,marginBottom:4}}>Value</div>
                {popStep===2 ? (
                  nextFilter.picklist ? (
                    <div style={{border:`2px solid ${T.sb}`,borderRadius:4,overflow:"hidden",background:"#f8fbff"}}>
                      {nextFilter.picklist.map(opt=>(
                        <div key={opt} onClick={()=>{setPicklistSel(opt);setPopStep(3);}} style={{
                          padding:"8px 12px",fontFamily:T.s,fontSize:12,cursor:"pointer",
                          background:picklistSel===opt?"#e8f4fd":"transparent",
                          borderBottom:`1px solid ${T.sbol}`,color:T.st,fontWeight:500,
                          display:"flex",justifyContent:"space-between",alignItems:"center",
                        }}>
                          <span>{opt}</span>
                          {opt===nextFilter.val&&<Pulse active style={{borderRadius:"50%",width:8,height:8,display:"inline-block"}}><span style={{display:"block",width:8,height:8,borderRadius:"50%",background:T.sb}}/></Pulse>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Pulse active style={{borderRadius:4}}>
                      <div onClick={()=>setPopStep(3)} style={{border:`2px solid ${T.sb}`,borderRadius:4,padding:"6px 10px",fontFamily:T.s,fontSize:12,cursor:"pointer",background:"#f8fbff",color:T.sb,fontWeight:600}}>Enter: {nextFilter.val}</div>
                    </Pulse>
                  )
                ) : (
                  <div style={{border:`1px solid ${T.sg}`,borderRadius:4,padding:"6px 10px",fontFamily:T.s,fontSize:12,background:"#f0f8f0",fontWeight:600,color:T.sbd}}>{nextFilter.picklist?picklistSel||nextFilter.val:nextFilter.val}</div>
                )}
              </div>}
              {/* Apply */}
              {popStep===3&&(
                <Pulse active style={{borderRadius:4,display:"inline-block"}}>
                  <button onClick={confirmFilter} style={{background:T.sb,color:"#fff",border:"none",padding:"8px 20px",borderRadius:4,fontFamily:T.s,fontSize:12,fontWeight:600,cursor:"pointer"}}>Apply Filter</button>
                </Pulse>
              )}
            </div>}

            {/* Show Me */}
            <div style={{border:`1px solid ${T.sbo}`,borderRadius:4,padding:"8px 10px",marginBottom:6,fontFamily:T.s}}>
              <div style={{fontSize:10,color:T.stm}}>Show Me</div>
              <div style={{fontSize:13,color:T.sb,fontWeight:500}}>{ex.sm}</div>
            </div>
            <div style={{border:`1px solid ${T.sbo}`,borderRadius:4,padding:"8px 10px",marginBottom:10,fontFamily:T.s}}>
              <div style={{fontSize:10,color:T.stm}}>Last Activity</div>
              <div style={{fontSize:13,color:T.sb,fontWeight:500}}>All Time</div>
            </div>
            {/* Pre-filled filters (from previous exercise) */}
            {prefilled.map((f,i)=><div key={"pre"+i} style={{
              border:`1px solid ${T.sbo}`,borderRadius:4,padding:"8px 10px",marginBottom:6,
              fontFamily:T.s,background:"#fafcfe",
            }}>
              <div style={{fontSize:10,color:T.stm}}>{f.obj} <span style={{fontStyle:"italic"}}>(from Exercise 2)</span></div>
              <div style={{fontSize:12,color:T.st}}>
                <span style={{fontWeight:600}}>{f.field}</span>{" "}
                <span style={{color:T.stm}}>{f.op}</span>{" "}
                <span style={{color:T.sbd,fontWeight:600}}>{f.val}</span>
              </div>
            </div>)}
            {/* Newly added filters */}
            {added.map(idx=>{const f=ex.filters[idx];return <div key={idx} style={{
              border:`1px solid ${T.sg}`,borderRadius:4,padding:"8px 10px",marginBottom:6,
              fontFamily:T.s,background:"#f0f8f0",
            }}>
              <div style={{fontSize:10,color:T.stm}}>{f.obj}</div>
              <div style={{fontSize:12,color:T.st}}>
                <span style={{fontWeight:600}}>{f.field}</span>{" "}
                <span style={{color:T.stm}}>{f.op}</span>{" "}
                <span style={{color:T.sbd,fontWeight:600}}>{f.picklist?(picklistSel||f.val):f.val}</span>
              </div>
            </div>;})}
          </>}
          {tab==="outline"&&<>
            <div style={{fontFamily:T.s,fontSize:12,fontWeight:700,color:T.st,marginBottom:8}}>Columns</div>
            {ex.cols.map(c=><div key={c} style={{padding:"4px 8px",fontFamily:T.s,fontSize:12,color:T.st,borderBottom:`1px solid ${T.sbol}`}}>{c}</div>)}
            {/* Grouping section */}
            {ex.grp&&<>
              <div style={{fontFamily:T.s,fontSize:12,fontWeight:700,color:T.st,marginTop:14,marginBottom:6}}>Group Rows By</div>
              {grpAdded ? (
                <div style={{padding:"6px 10px",background:"#e8f5e8",borderRadius:4,fontFamily:T.s,fontSize:12,fontWeight:600,color:T.sg,border:"1px solid #c4dca8"}}>{ex.grp} ✓</div>
              ) : showGrpPick ? (
                <div style={{border:`2px solid ${T.sb}`,borderRadius:6,overflow:"hidden",background:"#f8fbff"}}>
                  {grpOptions.map(opt=>(
                    <div key={opt} onClick={opt===ex.grp?()=>{setGrpAdded(true);setShowGrpPick(false);}:undefined} style={{
                      padding:"8px 12px",fontFamily:T.s,fontSize:12,
                      cursor:opt===ex.grp?"pointer":"default",
                      borderBottom:`1px solid ${T.sbol}`,
                      color:opt===ex.grp?T.sb:T.st,
                      fontWeight:opt===ex.grp?600:400,
                      background:opt===ex.grp?"#e8f4fd":"transparent",
                      display:"flex",justifyContent:"space-between",alignItems:"center",
                    }}>
                      <span>{opt}</span>
                      {opt===ex.grp&&<Pulse active style={{borderRadius:"50%",width:8,height:8,display:"inline-block"}}><span style={{display:"block",width:8,height:8,borderRadius:"50%",background:T.sb}}/></Pulse>}
                    </div>
                  ))}
                </div>
              ) : (
                <Pulse active={allFiltersDone} style={{borderRadius:4}}>
                  <div onClick={()=>setShowGrpPick(true)} style={{
                    border:`2px solid ${allFiltersDone?T.sb:T.sbo}`,borderRadius:4,padding:"8px 10px",
                    fontFamily:T.s,fontSize:12,color:allFiltersDone?T.sb:T.stm,
                    cursor:allFiltersDone?"pointer":"default",fontWeight:allFiltersDone?600:400,
                    background:allFiltersDone?"#f8fbff":"#fff",
                  }}>
                    + Add grouping
                  </div>
                </Pulse>
              )}
            </>}
          </>}
        </div>
      </div>

      {/* Preview area */}
      <div style={{flex:1,background:"#fafafa",padding:16}}>
        <div style={{background:"#e8f6e8",borderRadius:4,padding:"6px 12px",fontFamily:T.s,fontSize:11,color:T.sg,marginBottom:12}}>✓ Previewing a limited number of records. Run the report to see everything.</div>
        <div style={{display:"flex",borderBottom:`2px solid ${T.sbo}`,marginBottom:8,overflowX:"auto"}}>
          {ex.cols.map(c=><div key={c} style={{padding:"6px 10px",fontFamily:T.s,fontSize:11,fontWeight:700,color:T.stm,whiteSpace:"nowrap",minWidth:100,borderRight:`1px solid ${T.sbol}`}}>{c} ▾</div>)}
        </div>
        <div style={{fontFamily:T.s,fontSize:12,color:T.stm,padding:"20px 10px",textAlign:"center"}}>
          {allDone ? "All set — click Save & Run to see results." :
           !allFiltersDone ? `Add ${ex.filters.length-added.length} more filter${ex.filters.length-added.length>1?"s":""} to continue.` :
           "Filters done! Now switch to the Outline tab to add grouping."}
        </div>
      </div>
    </div>
    {/* Callouts */}
    {allDone&&<div style={{padding:"0 16px 12px"}}><Callout icon="✓">All filters and grouping applied! Click <strong>Save & Run</strong> to see your results.</Callout></div>}
    {allFiltersDone&&!allDone&&<div style={{padding:"0 16px 12px"}}><Callout icon="📊">Filters are set! Now switch to the <strong>Outline</strong> tab and add <strong>grouping</strong> by clicking <strong>+ Add grouping</strong>.</Callout></div>}
    {!allFiltersDone&&!showPop&&<div style={{padding:"0 16px 12px"}}><Callout icon="👆">Click <strong>Add filter</strong> to add your search criteria. {prefilled.length>0&&added.length===0?"Your Exercise 2 filters are already applied — add the new ones.":""}{added.length>0?`${added.length} down, ${ex.filters.length-added.length} to go.`:""}</Callout></div>}
  </div>;
}

/* ═══ RESULTS ═══ */
function Results({ex}){
  const grouped=!!ex.grp;
  if(grouped){
    return <div style={{background:T.sw,borderRadius:8,border:`1px solid ${T.sbo}`,overflow:"hidden"}}>
      <div style={{padding:"8px 16px",borderBottom:`1px solid ${T.sbo}`,background:"#fafafa",display:"flex",justifyContent:"space-between",fontFamily:T.s,fontSize:13}}><span style={{fontWeight:600}}>{ex.rt}</span><span style={{color:T.stm,fontSize:12}}>Summary Format</span></div>
      {ex.groups.map((g,gi)=><div key={gi}>
        <div style={{background:"#eef3f8",padding:"8px 14px",fontFamily:T.s,fontSize:13,fontWeight:700,color:T.sbd,borderBottom:`1px solid ${T.sbo}`,display:"flex",justifyContent:"space-between"}}><span>{ex.grp}: {g.g}</span><span style={{fontWeight:400,color:T.stm}}>{g.ct} records</span></div>
        <table style={{width:"100%",borderCollapse:"collapse",fontFamily:T.s,fontSize:12}}>
          {gi===0&&<thead><tr>{ex.cols.map(c=><th key={c} style={{textAlign:"left",padding:"6px 12px",fontSize:11,fontWeight:700,color:T.stm,borderBottom:`2px solid ${T.sbo}`,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>}
          <tbody>{g.rows.map((r,ri)=><tr key={ri} style={{background:ri%2===0?"#fff":"#fafcfe"}}>{ex.cols.map((c,ci)=><td key={c} style={{padding:"7px 12px",borderBottom:`1px solid ${T.sbol}`}}>{Object.values(r)[ci]}</td>)}</tr>)}</tbody>
        </table>
      </div>)}
    </div>;
  }
  return <div style={{background:T.sw,borderRadius:8,border:`1px solid ${T.sbo}`,overflow:"hidden"}}>
    <div style={{padding:"8px 16px",borderBottom:`1px solid ${T.sbo}`,background:"#fafafa",display:"flex",justifyContent:"space-between",fontFamily:T.s,fontSize:13}}><span style={{fontWeight:600}}>{ex.rt}</span><span style={{color:T.stm,fontSize:12}}>{ex.rows.length} records</span></div>
    <table style={{width:"100%",borderCollapse:"collapse",fontFamily:T.s,fontSize:12}}>
      <thead><tr>{ex.cols.map(c=><th key={c} style={{textAlign:"left",padding:"8px 12px",fontSize:11,fontWeight:700,color:T.stm,borderBottom:`2px solid ${T.sbo}`,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
      <tbody>{ex.rows.map((r,ri)=><tr key={ri} style={{background:ri%2===0?"#fff":"#fafcfe"}}>{ex.cols.map((c,ci)=><td key={c} style={{padding:"8px 12px",borderBottom:`1px solid ${T.sbol}`,whiteSpace:"nowrap"}}>{Object.values(r)[ci]}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

/* ═══ EXERCISE FLOW ═══ */
const STG_FULL=["The Question","Reports Tab","Pick Report Type","Build Report","Results","Try It"];
const STG_SHORT=["The Question","Build Report","Results","Try It"];
function Flow({ex,onBack,onComplete,onNext,nextLabel}){
  const hasPre=!!ex.prefilled;
  const STG=hasPre?STG_SHORT:STG_FULL;
  const[s,setS]=useState(0);
  const[sel,setSel]=useState(null);
  // Hint visibility for the "Pick Report Type" stage. Off by default —
  // the learner should reason from the object names before seeing the
  // pulsing outline around the correct row.
  const[rtHint,setRtHint]=useState(false);
  // Map display stage index to logical stage
  const stageMap=hasPre?{0:0,1:3,2:4,3:5}:{0:0,1:1,2:2,3:3,4:4,5:5};
  const logical=stageMap[s];
  // Fire onComplete the first time the learner reaches the "Try It"
  // stage (logical===5). The LMS wrapper treats this as the exercise
  // being done and unlocks the next sidebar section.
  useEffect(()=>{ if(logical===5&&onComplete) onComplete(ex.id); },[logical,ex.id,onComplete]);
  // Find display stage for a given logical stage
  const toDisplay=(logStage)=>{
    for(const[d,l] of Object.entries(stageMap)){if(l===logStage)return Number(d);}
    return 0;
  };
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      {/* "← Exercises" is only shown in the standalone demo (where the
          parent still passes onBack to return to the exercise picker).
          Inside the LMS wrapper the sidebar is the navigation surface,
          so we omit onBack and this button disappears. */}
      {onBack&&<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontFamily:T.d,fontSize:14,color:T.tm}}>← Exercises</button>}
      <Badge>{`Exercise ${ex.id}`}</Badge>
      <span style={{fontFamily:T.d,fontSize:16,fontWeight:700}}>{ex.title}</span>
    </div>
    <div style={{display:"flex",gap:2,marginBottom:20}}>
      {STG.map((l,i)=><button key={i} onClick={()=>setS(i)} style={{flex:1,padding:"8px 2px",border:"none",cursor:"pointer",background:i===s?T.sb:i<s?"#c4dca8":"rgba(58,50,38,0.08)",color:i===s?"#fff":i<s?"#2e6b1a":T.tm,fontFamily:T.s,fontSize:10,fontWeight:600,borderRadius:i===0?"6px 0 0 6px":i===STG.length-1?"0 6px 6px 0":0}}>{l}</button>)}
    </div>
    <div style={{background:logical>=1&&logical<=4?"transparent":T.card,borderRadius:14,border:logical>=1&&logical<=4?"none":`1px solid ${T.cb}`,padding:logical>=1&&logical<=4?0:20,minHeight:300}}>
      {logical===0&&<div>
        <div style={{fontFamily:T.d,fontSize:20,fontWeight:700,marginBottom:12,lineHeight:1.3}}>"{ex.q}"</div>
        <div style={{fontFamily:T.d,fontSize:14,color:T.tm,marginBottom:16,lineHeight:1.6}}>Before touching Salesforce, think about the data you need. Which objects hold the fields this question is asking about?</div>
        <div style={{background:"#fff",borderRadius:8,padding:16,border:`1px solid ${T.sbo}`}}>
          <div style={{fontFamily:T.s,fontSize:11,fontWeight:700,color:T.stm,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Fields you'll need</div>
          {ex.prefilled&&<>
            {ex.prefilled.map((f,i)=><div key={"pf"+i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontFamily:T.s,fontSize:13,opacity:0.55}}>
              <Pill name={f.obj}/><span>→</span><span style={{fontWeight:600}}>{f.field}</span><span style={{fontSize:10,color:T.stm,fontStyle:"italic"}}>(already set)</span>
            </div>)}
          </>}
          {ex.filters.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontFamily:T.s,fontSize:13}}><Pill name={f.obj}/><span>→</span><span style={{fontWeight:600}}>{f.field}</span>{f.picklist&&<span style={{fontSize:10,color:T.stm,fontStyle:"italic"}}>(picklist)</span>}</div>)}
          {ex.grp&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontFamily:T.s,fontSize:13}}><Pill name="Account"/><span>→</span><span style={{fontWeight:600}}>{ex.grp} (for grouping)</span></div>}
        </div>
        {ex.filters.some(f=>f.obj!==ex.filters[0].obj)&&<Callout icon="🔗">Notice the fields live on <strong>different objects</strong>. We'll need a combined report type.</Callout>}
        {ex.filters.every(f=>f.obj===ex.filters[0].obj)&&!ex.grp&&!ex.prefilled&&<Callout icon="📦">All the fields live on <strong>one object</strong>. A single-object report type will do.</Callout>}
        {ex.prefilled&&<Callout icon="🔄">This builds on Exercise 2 — your previous filters are already applied. You'll add <strong>Type</strong> and <strong>Account Record Type</strong> filters to narrow the results to living clients, then add <strong>grouping</strong> by {ex.grp}.</Callout>}
        {ex.grp&&!ex.prefilled&&<Callout icon="📊">This builds on Exercise 2 — same data, but adding <strong>grouping</strong> by {ex.grp}.</Callout>}
      </div>}
      {logical===1&&<div>
        <Callout icon="👇">This is the <strong>Reports tab</strong>. Click the pulsing <strong>New Report</strong> button to begin.</Callout>
        <ReportsTab onNew={()=>setS(toDisplay(2))}/>
      </div>}
      {logical===2&&(()=>{
        // Distinct objects across the filters the learner still has to
        // add (prefilled filters are excluded — the learner isn't
        // reasoning about those at this step). Grammar: "Account
        // object" vs "Account and CMS Claim Submission objects".
        const objs=[...new Set(ex.filters.map(f=>f.obj))];
        const objList=objs.length===1?objs[0]:objs.length===2?`${objs[0]} and ${objs[1]}`:`${objs.slice(0,-1).join(", ")}, and ${objs[objs.length-1]}`;
        const objLabel=objs.length===1?"object":"objects";
        return <div>
          <Callout icon="👇">Choose the correct report type. Remember, the fields that you are looking to filter by live on the <strong>{objList}</strong> {objLabel}.</Callout>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
            <button onClick={()=>setRtHint(h=>!h)} style={{background:rtHint?T.sb:"#fff",color:rtHint?"#fff":T.sb,border:`1.5px solid ${T.sb}`,padding:"6px 14px",borderRadius:6,fontFamily:T.s,fontSize:12,fontWeight:600,cursor:"pointer"}}>
              {rtHint?"Hide hint":"💡 Show hint"}
            </button>
          </div>
          <CreateReport ex={ex} sel={sel} onSel={setSel} onStart={()=>setS(toDisplay(3))} hint={rtHint}/>
        </div>;
      })()}
      {logical===3&&<div>
        <Callout icon="👇">{ex.grp
          ? <>Add your new filters, then switch to <strong>Outline</strong> to set up grouping. Pulsing elements show you what to click next.</>
          : <>Click the pulsing <strong>Add filter</strong> button, then step through each selection. When all filters are set, <strong>Save & Run</strong> will light up.</>
        }</Callout>
        <Builder ex={ex} onRun={()=>setS(toDisplay(4))}/>
      </div>}
      {logical===4&&<div>
        <Callout icon="✓">Here are your results!</Callout>
        <Results ex={ex}/>
        {ex.grp&&<Callout icon="📊">Results organized by <strong>{ex.grp}</strong> with counts — that's the power of Summary reports.</Callout>}
      </div>}
      {logical===5&&<div style={{background:T.card,borderRadius:14,border:`1px solid ${T.cb}`,padding:20}}>
        <div style={{fontFamily:T.d,fontSize:20,fontWeight:700,marginBottom:12}}>Your turn.</div>
        <div style={{background:"#fff",borderRadius:8,padding:18,border:`1px solid ${T.sbo}`,marginBottom:16,fontFamily:T.s,fontSize:14,color:T.st,lineHeight:1.7}}>
          <div style={{fontSize:11,fontWeight:700,color:T.stm,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Steps</div>{ex.tryIt}
        </div>
        <div style={{background:T.sbl,borderRadius:8,padding:16,border:"1px solid rgba(1,118,211,0.2)",fontFamily:T.s,fontSize:13,color:T.sbd,lineHeight:1.6}}><strong>Check your work:</strong> Compare your report to the saved version linked in the LMS. What matters is the right report type, the right filters, and the right records — not exact formatting.</div>
        <Callout icon="🔑"><strong>Remember:</strong> identify which objects your data lives on first, then pick a report type that covers those objects.</Callout>
        {/* LMS-driven "advance to next exercise" button — shown when the
            wrapper passes an onNext handler (exercises 1 and 2 inside the
            Salesforce Basics module). Exercise 3 is the last one, so the
            wrapper omits onNext there and the outer CompletionCard-style
            footer takes over. */}
        {onNext&&<div style={{marginTop:20,display:"flex",justifyContent:"center"}}>
          <button onClick={onNext} style={{padding:"12px 24px",background:T.sb,color:"#fff",border:"none",borderRadius:8,fontSize:14,fontFamily:T.d,fontWeight:700,cursor:"pointer"}}>{nextLabel||"Next Exercise →"}</button>
        </div>}
      </div>}
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:12,maxWidth:380,margin:"16px auto 0"}}>
      <button onClick={()=>setS(x=>Math.max(0,x-1))} disabled={s===0} style={{flex:1,padding:"11px 18px",background:s===0?"rgba(58,50,38,0.07)":T.text,color:s===0?"rgba(58,50,38,0.25)":"#faf5ea",border:"none",borderRadius:10,fontSize:13.5,fontFamily:T.d,cursor:s===0?"default":"pointer",fontWeight:600}}>← Back</button>
      <button onClick={()=>setS(x=>Math.min(STG.length-1,x+1))} disabled={s===STG.length-1} style={{flex:1,padding:"11px 18px",background:s===STG.length-1?"rgba(58,50,38,0.07)":T.text,color:s===STG.length-1?"rgba(58,50,38,0.25)":"#faf5ea",border:"none",borderRadius:10,fontSize:13.5,fontFamily:T.d,cursor:s===STG.length-1?"default":"pointer",fontWeight:600}}>Next →</button>
    </div>
  </div>;
}

// Named exports so an LMS wrapper can drive the Flow directly —
// rendering a single exercise inline without the built-in
// exercise-picker view. Kept alongside the default export so the
// component still works standalone.
export { EX, Flow, InjectCSS };

/* ═══ MAIN ═══ */
export default function ReportingModule(){
  const[a,setA]=useState(null);
  return <>
    <InjectCSS/>
    {a!==null
      ? <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.d,color:T.text,padding:"20px 16px",boxSizing:"border-box"}}><div style={{maxWidth:860,margin:"0 auto"}}><Flow ex={EX.find(e=>e.id===a)} onBack={()=>setA(null)}/></div></div>
      : <div style={{minHeight:"100vh",background:T.bg,fontFamily:T.d,color:T.text,padding:"24px 16px",boxSizing:"border-box"}}><div style={{maxWidth:660,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"inline-block",background:T.text,color:"#faf5ea",padding:"4px 18px",borderRadius:20,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",fontFamily:T.m,marginBottom:8}}>Salesforce Reporting</div>
          <h1 style={{fontSize:26,fontWeight:400,margin:"8px 0 0",letterSpacing:-0.5}}>Building Reports</h1>
          <p style={{fontSize:13,opacity:0.5,margin:"4px 0 0",fontStyle:"italic"}}>From question to answer — three guided exercises</p>
        </div>
        <Callout icon="📦"><strong>Quick recap from Objects: Containers for Data</strong> — a report type tells Salesforce which objects to look in. One object? Pick that object's report. Multiple? Pick a combined report type.</Callout>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:20}}>
          {EX.map(ex=><button key={ex.id} onClick={()=>setA(ex.id)} style={{display:"flex",gap:16,alignItems:"flex-start",padding:18,borderRadius:12,cursor:"pointer",border:`1px solid ${T.cb}`,background:T.card,textAlign:"left",boxShadow:"0 2px 12px rgba(58,50,38,0.04)"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:T.text,color:"#faf5ea",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.d,fontSize:18,fontWeight:700,flexShrink:0}}>{ex.id}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:T.d,fontSize:16,fontWeight:700,marginBottom:4}}>{ex.title}</div>
              <div style={{fontFamily:T.d,fontSize:13,color:T.tm,lineHeight:1.5,marginBottom:8}}>"{ex.q}"</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[...new Set(ex.filters.map(f=>f.obj))].map(o=><Pill key={o} name={o}/>)}
                {ex.grp&&<span style={{display:"inline-block",padding:"3px 10px",borderRadius:12,fontSize:11,fontFamily:T.s,fontWeight:600,background:"#f0f7e8",color:"#2e6b1a",border:"1px solid #c4dca8"}}>+ Grouping</span>}
              </div>
            </div>
            <div style={{fontFamily:T.d,fontSize:22,color:T.tm,alignSelf:"center"}}>→</div>
          </button>)}
        </div>
        <p style={{textAlign:"center",fontSize:12,opacity:0.4,marginTop:20,fontFamily:T.m}}>Each exercise builds on the last. Start with Exercise 1.</p>
      </div></div>
    }
  </>;
}
