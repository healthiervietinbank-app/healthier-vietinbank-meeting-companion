import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check, ChevronRight,
  ClipboardCheck, Clock3, Eye, EyeOff, HeartHandshake, Home, Lightbulb,
  LockKeyhole, LogOut, Menu, MessageSquareText, Plus, RotateCcw, Search,
  Settings, ShieldCheck, Sparkles, Target, Trash2, UserRound, Users, X
} from "lucide-react";
import { checkIns, checkOuts, initialMeetings, journalEntries, mockFeedback, mockUsers, situations } from "./mockData";

const CONSENT = [
  "Chúng tôi trân trọng những nội dung bạn chia sẻ trong quá trình thực hành điều phối.",
  "Healthier VietinBank không kết nối hoặc truy cập vào các hệ thống và dữ liệu nội bộ của ngân hàng. Ứng dụng chỉ lưu những thông tin bạn chủ động nhập trong quá trình sử dụng.",
  "Để bạn có thể xem lại các cuộc họp và theo dõi Nhật ký phát triển năng lực điều phối, dữ liệu được lưu trên Google Sheets do đội ngũ phát triển quản lý.",
  "Chỉ những quản trị viên được cấp quyền và chủ sở hữu Google Sheet mới có thể truy cập dữ liệu đã lưu khi cần thiết để vận hành và hỗ trợ hệ thống.",
  "Để bảo vệ chính bạn và tổ chức, vui lòng không nhập tên khách hàng, số tài khoản, thông tin thẻ, mật khẩu, dữ liệu định danh cá nhân hoặc các nội dung nghiệp vụ nhạy cảm.",
  "Dữ liệu sẽ được lưu cho đến khi bạn chủ động yêu cầu xóa. Khi đó, nội dung sẽ không còn hiển thị trong ứng dụng và sẽ được xóa khỏi dữ liệu hoạt động trong vòng 30 ngày.",
  "Để đảm bảo khả năng khôi phục khi xảy ra sự cố, hệ thống vẫn duy trì các bản sao lưu. Khi bạn yêu cầu xóa dữ liệu, hệ thống sẽ ghi nhận yêu cầu này để nội dung đã xóa không được khôi phục trở lại trong quá trình phục hồi từ bản sao lưu."
];

const nav = [
  ["home","Hôm nay",Home], ["prepare","Prepare",Sparkles], ["journal","Nhật ký",BookOpen],
  ["feedback","Góp ý",MessageSquareText], ["account","Tài khoản",UserRound]
];
const types = ["Giao ban","Brainstorm thúc đẩy kinh doanh","Đánh giá định kỳ","Rút kinh nghiệm"];

function Brand({compact=false}) {
  return <div className={`brand ${compact?"compact":""}`}>
    <img src="/healthier-vietinbank-logo.png" alt="Healthier VietinBank"/>
    <div><b>Đồng hành điều phối</b><span>Healthier VietinBank</span></div>
  </div>;
}
function Pill({children,tone="blue"}) { return <span className={`pill ${tone}`}>{children}</span> }
function Notice() { return <div className="safe-note"><ShieldCheck size={18}/><span>Không nhập dữ liệu khách hàng hoặc nội dung nghiệp vụ nhạy cảm.</span></div> }

function Login({onLogin}) {
  const [mode,setMode]=useState("login"), [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",userAD:"",role:"Trưởng phòng",pin:""}), [error,setError]=useState("");
  const submit=e=>{e.preventDefault(); if(!form.userAD||!/^\d{6}$/.test(form.pin)){setError("Vui lòng nhập userAD và mã PIN gồm đúng 6 số.");return}
    const knownNames={"minhanh.n":"Nguyễn Minh Anh","admin.vtb":"Quản trị viên"};
    onLogin({name:form.name||knownNames[form.userAD]||form.userAD,userAD:form.userAD,role:form.userAD==="admin.vtb"?"Admin":form.role,isAdmin:form.userAD==="admin.vtb"});
  };
  return <div className="auth-page">
    <section className="auth-story">
      <Brand/>
      <div className="story-copy"><Pill tone="cyan">AI đồng hành trong thực hành điều phối</Pill>
        <h1>Vững vàng hơn qua<br/><em>từng cuộc họp.</em></h1>
        <p>Chuẩn bị đúng trọng tâm, nhìn lại điều đã diễn ra và tích lũy năng lực điều phối theo cách của bạn.</p>
        <div className="story-points"><div><Target/><span><b>Trước cuộc họp</b>Nhìn rõ điều đáng chú ý nhất</span></div><div><BookOpen/><span><b>Sau cuộc họp</b>Chuyển trải nghiệm thành bài học</span></div></div>
      </div>
      <small>Healthy Mind · Healthy Life</small>
    </section>
    <main className="auth-panel"><div className="auth-card">
      <div className="mobile-brand"><Brand compact/></div>
      <h2>{mode==="login"?"Chào mừng bạn trở lại":"Bắt đầu hành trình"}</h2>
      <p>{mode==="login"?"Tiếp tục chuẩn bị cho cuộc họp tiếp theo.":"Tạo hồ sơ để lưu lại nhật ký thực hành."}</p>
      <div className="tabs"><button className={mode==="login"?"active":""} onClick={()=>setMode("login")}>Đăng nhập</button><button className={mode==="register"?"active":""} onClick={()=>setMode("register")}>Tạo tài khoản</button></div>
      <form onSubmit={submit}>
        {mode==="register"&&<><label>Họ và tên<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nguyễn Minh Anh"/></label><label>Vị trí<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Trưởng phòng</option><option>Phó giám đốc</option></select></label></>}
        <label>userAD<input value={form.userAD} onChange={e=>setForm({...form,userAD:e.target.value.trim()})} placeholder="Ví dụ: minhanh.n" autoCapitalize="none"/></label>
        <label>Mã PIN cá nhân<div className="password"><input type={show?"text":"password"} inputMode="numeric" maxLength="6" value={form.pin} onChange={e=>setForm({...form,pin:e.target.value.replace(/\D/g,"")})} placeholder="6 chữ số"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>
        {error&&<div className="form-error">{error}</div>}
        <button className="primary wide">{mode==="login"?"Đăng nhập":"Tạo tài khoản"}<ArrowRight/></button>
      </form>
      <button className="text-btn">Quên mã PIN?</button>
      <p className="help">Cần hỗ trợ PIN? Liên hệ <b>healthiervtb@vietinbank.vn</b></p>
    </div></main>
  </div>
}

function Consent({onAccept,onCancel}) {
  const [ok,setOk]=useState(false);
  return <div className="modal-back"><div className="consent modal">
    <div className="modal-head"><div className="icon-orb"><ShieldCheck/></div><div><h2>Hiểu cách dữ liệu của bạn được lưu trữ</h2><p>Vui lòng đọc trước khi bắt đầu.</p></div></div>
    <div className="consent-copy">{CONSENT.map((p,i)=><p key={i}>{p}</p>)}</div>
    <label className="check-line"><input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)}/><span>Tôi đã đọc và hiểu cách dữ liệu của mình được lưu trữ, đồng thời đồng ý không nhập dữ liệu ngân hàng nhạy cảm.</span></label>
    <div className="modal-actions"><button className="secondary" onClick={onCancel}>Quay lại</button><button className="primary" disabled={!ok} onClick={onAccept}>Đồng ý và tiếp tục</button></div>
  </div></div>
}

function Shell({user,page,setPage,onLogout,children}) {
  const [open,setOpen]=useState(false);
  return <div className="app-shell">
    <aside className={open?"open":""}><div className="aside-top"><Brand compact/><button className="close-menu" onClick={()=>setOpen(false)}><X/></button></div>
      <nav>{nav.map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>{setPage(id);setOpen(false)}}><Icon/><span>{label}</span>{id==="prepare"&&<i/>}</button>)}</nav>
      {user.isAdmin&&<><div className="nav-label">QUẢN TRỊ</div><nav><button className={page==="admin"?"active":""} onClick={()=>{setPage("admin");setOpen(false)}}><Settings/><span>Admin Console</span></button></nav></>}
      <div className="user-mini"><div>{user.name.split(" ").slice(-2).map(x=>x[0]).join("")}</div><span><b>{user.name}</b><small>{user.role}</small></span><button onClick={onLogout}><LogOut/></button></div>
    </aside>
    {open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
    <section className="main-area"><header><button className="menu" onClick={()=>setOpen(true)}><Menu/></button><div className="header-title">{nav.find(x=>x[0]===page)?.[1]||"Admin Console"}</div><div className="header-right"><Pill tone="cyan">Bản mẫu local</Pill><button className="avatar" onClick={()=>setPage("account")}>{user.name.split(" ").slice(-2).map(x=>x[0]).join("")}</button></div></header>
      <main>{children}</main>
    </section>
  </div>
}

function HomePage({user,setPage,startReview,meetings}) {
  return <div className="page home-page">
    <div className="welcome"><div><span className="eyebrow">THỨ HAI, 27 THÁNG 7</span><h1>Xin chào, {user.name.split(" ").slice(-2).join(" ")} 👋</h1><p>Hôm nay, bạn muốn cuộc họp nào diễn ra tốt hơn?</p></div><button className="primary" onClick={()=>setPage("prepare")}><Plus/>Chuẩn bị cuộc họp</button></div>
    <Notice/>
    <section className="next-card"><div className="next-date"><b>30</b><span>THÁNG 7</span></div><div className="next-body"><div><Pill>CUỘC HỌP TIẾP THEO</Pill><h2>Giao ban kinh doanh tuần 31</h2><p><Clock3/>08:30 – 09:30 · <Users/>Ban giám đốc, Trưởng/phó các phòng</p></div><div className="carry"><Sparkles/><span><b>Điều đáng mang theo</b>Mời từng đơn vị diễn đạt tác động tới kế hoạch tuần trước khi chốt action.</span></div></div><button className="secondary">Xem chuẩn bị<ChevronRight/></button></section>
    <div className="home-grid"><section><div className="section-head"><div><h2>Cần bạn nhìn lại</h2><p>Một cuộc họp đang chờ Review.</p></div></div><div className="review-nudge"><div className="icon-orb coral"><ClipboardCheck/></div><div><Pill tone="coral">CHỜ REVIEW</Pill><h3>Giao ban vận hành tháng 7</h3><p>24/07/2026 · Khoảng 5 phút</p></div><button className="primary soft" onClick={()=>startReview(meetings[1])}>Review ngay</button></div></section>
    <section><div className="section-head"><div><h2>Thử nghiệm đang mang theo</h2><p>Từ lần nhìn lại gần nhất.</p></div></div><div className="experiment-card"><Lightbulb/><p>“Mời từng đơn vị diễn đạt tác động trước khi chốt action.”</p><span>Đã thử 1 lần · Ghi nhận trong Nhật ký</span></div></section></div>
    <section className="recent"><div className="section-head"><div><h2>Các cuộc họp gần đây</h2><p>Tiếp tục từ nơi bạn đã dừng.</p></div><button className="text-btn" onClick={()=>setPage("journal")}>Xem nhật ký <ArrowRight/></button></div>
      <div className="meeting-list">{meetings.map(m=><div className="meeting-row" key={m.id}><div className={`meeting-icon ${m.status}`}><CalendarDays/></div><div><h3>{m.title}</h3><p>{m.date} · {m.type}</p></div><Pill tone={m.status==="reviewed"?"green":m.status==="waiting-review"?"coral":"blue"}>{m.statusLabel}</Pill><button className="icon-btn"><ChevronRight/></button></div>)}</div>
    </section>
  </div>
}

function Stepper({step,labels}) {return <div className="stepper">{labels.map((x,i)=><div className={`${i+1===step?"active":""} ${i+1<step?"done":""}`} key={x}><span>{i+1<step?<Check/>:i+1}</span><b>{x}</b></div>)}</div>}
function deriveMeetingUnderstanding(form) {
  const type = form.type === "Giao ban" ? "cuộc họp giao ban" : `buổi ${form.type.toLowerCase()}`;
  const purpose = form.purpose.trim() || "một mục tiêu cần được làm rõ";
  const outcome = form.outcome.trim() || "một thay đổi cụ thể sau cuộc họp";
  const difficulty = form.difficulty.trim() || "một điểm cần chú ý trong quá trình điều phối";
  return `Đây là ${type} nhằm ${purpose.toLowerCase()} Nhóm cần đi tới ${outcome.toLowerCase()}. Điểm cần chú ý là ${difficulty.toLowerCase()}.`;
}
function PreparePage({onDone}) {
  const labels=["Bối cảnh","Làm rõ","Tình huống","Câu hỏi","Tóm tắt"];
  const [step,setStep]=useState(1), [form,setForm]=useState({title:"Giao ban kinh doanh tuần 32",type:"Giao ban",date:"2026-08-06",time:"08:30",duration:"60",position:"Chủ trì và ra quyết định",participants:"Ban giám đốc, Trưởng/phó các phòng",purpose:"Thống nhất trọng tâm kinh doanh tuần và những hỗ trợ cần phối hợp.",outcome:"Mỗi đơn vị hiểu tác động tới kế hoạch và nhận action rõ owner, thời hạn.",difficulty:"Nhiều nội dung cập nhật, khó biết người tham gia đã thực sự “thông” hay chưa.",situation:0,checkIn:2,checkOut:0}), [editingUnderstanding,setEditingUnderstanding]=useState(false), [understandingDraft,setUnderstandingDraft]=useState("");
  const set=(k,v)=>setForm({...form,[k]:v});
  const understanding = understandingDraft || deriveMeetingUnderstanding(form);
  return <div className="page wizard-page"><div className="wizard-title"><button className="icon-btn" onClick={()=>step>1&&setStep(step-1)}><ArrowLeft/></button><div><span className="eyebrow">PREPARE · KHOẢNG 5–8 PHÚT</span><h1>Chuẩn bị cuộc họp</h1><p>Nhìn rõ điều quan trọng nhất trước khi bắt đầu.</p></div></div><Stepper step={step} labels={labels}/><Notice/>
    <div className="wizard-card">
      {step===1&&<><div className="card-heading"><Pill>01 · BỐI CẢNH</Pill><h2>Cuộc họp nào sắp diễn ra?</h2><p>Thông tin này giúp gợi ý phù hợp với vai trò và loại cuộc họp.</p></div><div className="form-grid"><label className="span2">Tên cuộc họp<input value={form.title} onChange={e=>set("title",e.target.value)}/></label><label>Loại cuộc họp<select value={form.type} onChange={e=>set("type",e.target.value)}>{types.map(x=><option>{x}</option>)}</select></label><label>Vai trò của bạn<select value={form.position} onChange={e=>set("position",e.target.value)}><option>Chủ trì và ra quyết định</option><option>Điều phối thay người chủ trì</option><option>Chủ trì và cùng nhóm ra quyết định</option></select></label><label>Ngày<input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></label><label>Thời gian<div className="inline-fields"><input type="time" value={form.time} onChange={e=>set("time",e.target.value)}/><input type="number" value={form.duration} onChange={e=>set("duration",e.target.value)}/><i>phút</i></div></label><label className="span2">Người tham gia<input value={form.participants} onChange={e=>set("participants",e.target.value)}/><small>Không nhập tên cá nhân nếu không cần thiết.</small></label></div><div className="agenda-note"><CalendarDays/><div><b>Gửi agenda trước cuộc họp</b><p>Nên gửi trước các nội dung chính, mục tiêu và thời lượng dự kiến để người tham gia hình dung rõ, chuẩn bị tốt hơn và giúp bạn kiểm soát thời gian hiệu quả.</p></div></div></>}
      {step===2&&<><div className="card-heading"><Pill>02 · LÀM RÕ</Pill><h2>Cuộc họp cần tạo ra điều gì?</h2><p>Phân biệt nội dung muốn truyền đạt với thay đổi cần có sau cuộc họp.</p></div><div className="form-stack"><label>Mục đích thực sự của cuộc họp là gì?<textarea value={form.purpose} onChange={e=>{set("purpose",e.target.value);setUnderstandingDraft("")}}/></label><label>Sau cuộc họp, người tham gia cần hiểu hoặc làm được điều gì?<textarea value={form.outcome} onChange={e=>{set("outcome",e.target.value);setUnderstandingDraft("")}}/></label><label>Điều gì có thể khiến cuộc họp này khó?<textarea value={form.difficulty} onChange={e=>{set("difficulty",e.target.value);setUnderstandingDraft("")}}/></label></div><div className="reflect-box"><Sparkles/><div><b>AI đang hiểu cuộc họp như thế nào?</b>{editingUnderstanding?<textarea className="understanding-edit" value={understandingDraft||understanding} onChange={e=>setUnderstandingDraft(e.target.value)} onBlur={()=>setEditingUnderstanding(false)} autoFocus/>:<p>{understanding}</p>}<button className="text-btn" onClick={()=>{setUnderstandingDraft(understanding);setEditingUnderstanding(true)}}>{editingUnderstanding?"Đang chỉnh cách hiểu…":"Chỉnh lại cách hiểu"}</button><small className="reflection-meta">Cách hiểu này được tạo từ thông tin bạn vừa nhập và có thể chỉnh lại theo thực tế.</small></div></div></>}
      {step===3&&<><div className="card-heading"><Pill>03 · TÌNH HUỐNG</Pill><h2>Điều gì có thể làm bạn khó xử?</h2><p>Chọn tình huống gần nhất. Bạn chỉ cần mang theo một cách xử lý.</p></div><div className="situation-layout"><div className="choice-list">{situations.map((s,i)=><button onClick={()=>set("situation",i)} className={form.situation===i?"selected":""}><span>{s.name}</span>{form.situation===i?<Check/>:<ChevronRight/>}</button>)}</div><div className="tip-card"><Pill tone="purple">GỢI Ý XỬ LÝ</Pill><h3>{situations[form.situation].name}</h3><dl><dt>Tín hiệu có thể thấy</dt><dd>{situations[form.situation].signal}</dd><dt>Một khả năng là</dt><dd>{situations[form.situation].interpretation}</dd><dt>Bạn có thể thử</dt><dd className="suggest">{situations[form.situation].suggestion}</dd></dl></div></div></>}
      {step===4&&<><div className="card-heading"><Pill>04 · CÂU HỎI</Pill><h2>Mở và khép cuộc họp có chủ đích</h2><p>Check-in giúp mọi người cùng có mặt và lộ cách hiểu ban đầu. Check-out kiểm chứng mức “thông” và chuyển thành hành động.</p></div><div className="timing-note"><Clock3/><span><b>Thời lượng gợi ý</b>Check-in: 5–10 phút · Check-out: 5–10 phút. Với cuộc họp đông người, có thể yêu cầu mọi người viết trước để giữ nhịp và kiểm soát thời gian.</span></div><QuestionPicker title="Câu hỏi check-in" duration="5–10 phút" items={checkIns} selected={form.checkIn} setSelected={i=>set("checkIn",i)}/><QuestionPicker title="Câu hỏi check-out" duration="5–10 phút" items={checkOuts} selected={form.checkOut} setSelected={i=>set("checkOut",i)}/></>}
      {step===5&&<><div className="card-heading"><Pill>05 · TÓM TẮT</Pill><h2>Điều đáng mang theo vào cuộc họp</h2><p>Một thay đổi có ý nghĩa nhất — đủ gọn để bạn thực sự dùng.</p></div><div className="takeaway"><div className="spark-big"><Sparkles/></div><span>TRỌNG TÂM HÔM NAY</span><h2>Đừng chỉ hỏi “mọi người đã rõ chưa?”</h2><p>Mời từng đơn vị diễn đạt <b>ưu tiên nào sẽ thay đổi</b>, sau đó chốt action bằng lời của chính người chịu trách nhiệm.</p></div><div className="summary-grid"><Summary icon={Target} title="Cách AI hiểu cuộc họp" text="Thống nhất tác động của ưu tiên kinh doanh và chuyển thành action cụ thể."/><Summary icon={MessageSquareText} title="Check-in" text={checkIns[form.checkIn].question}/><Summary icon={ClipboardCheck} title="Check-out" text={checkOuts[form.checkOut].question}/><Summary icon={Lightbulb} title="Khi gặp tình huống khó" text={situations[form.situation].suggestion}/></div></>}
      <div className="wizard-actions"><button className="secondary" onClick={()=>step>1&&setStep(step-1)} disabled={step===1}><ArrowLeft/>Quay lại</button><span>Bước {step}/{labels.length}</span><button className="primary" onClick={()=>step<5?setStep(step+1):onDone(form)}>{step<5?"Tiếp tục":"Lưu chuẩn bị"}{step<5?<ArrowRight/>:<Check/>}</button></div>
    </div>
  </div>
}
function QuestionPicker({title,duration,items,selected,setSelected}) {return <div className="question-section"><div className="question-title"><div><h3>{title}</h3><small className="duration-label"><Clock3/>Gợi ý: {duration}</small></div><button className="secondary small" onClick={()=>setSelected((selected+1)%items.length)}><RotateCcw/>Đổi câu khác</button></div><div className="question-focus"><Pill tone="cyan">{items[selected].category}</Pill><blockquote>“{items[selected].question}”</blockquote><p><Lightbulb/>Vì sao dùng câu này: {items[selected].why}</p></div><div className="question-dots">{items.map((_,i)=><button className={i===selected?"active":""} onClick={()=>setSelected(i)} aria-label={`Câu ${i+1}`}/>)}</div><small className="question-count">Câu {selected+1}/{items.length}</small></div>}
function Summary({icon:Icon,title,text}) {return <div className="summary-item"><Icon/><div><b>{title}</b><p>{text}</p></div></div>}

function ReviewPage({meeting,onDone,onCancel}) {
  const labels=["Nhìn lại","Mức thông","Action","Điều học được","Xác nhận"];
  const [step,setStep]=useState(1), [understanding,setUnderstanding]=useState(3), [confirmed,setConfirmed]=useState(null);
  return <div className="page wizard-page"><div className="wizard-title"><button className="icon-btn" onClick={onCancel}><X/></button><div><span className="eyebrow">REVIEW · KHOẢNG 5 PHÚT</span><h1>Nhìn lại cuộc họp</h1><p>{meeting?.title}</p></div></div><Stepper step={step} labels={labels}/><Notice/><div className="wizard-card">
    {step===1&&<><div className="card-heading"><Pill tone="coral">01 · NHÌN LẠI</Pill><h2>Điều gì thực sự đã xảy ra?</h2><p>Ghi lại quan sát trước khi diễn giải.</p></div><div className="meeting-context"><CalendarDays/><div><b>{meeting?.title}</b><span>{meeting?.date} · {meeting?.purpose}</span></div></div><div className="form-stack"><label>Khoảnh khắc nào đáng nhớ nhất?<textarea defaultValue="Khi được hỏi kế hoạch sẽ thay đổi thế nào, hai đơn vị diễn đạt ưu tiên khác nhau."/></label><label>Bạn đã quan sát thấy điều gì? <small>Chỉ mô tả điều có thể kiểm chứng.</small><textarea defaultValue="Ba trong năm đơn vị nêu được tác động cụ thể; hai đơn vị chỉ xác nhận “đã rõ”."/></label></div></>}
    {step===2&&<><div className="card-heading"><Pill tone="coral">02 · MỨC “THÔNG”</Pill><h2>Thông điệp đã được hiểu đến đâu?</h2><p>Đánh giá dựa trên điều người tham gia nói hoặc làm, không dựa vào cảm giác chung.</p></div><div className="scale"><div className="scale-labels"><span>Chưa rõ</span><span>Rõ và chuyển thành hành động</span></div><div>{[1,2,3,4,5].map(n=><button className={understanding===n?"active":""} onClick={()=>setUnderstanding(n)}>{n}</button>)}</div><b>{understanding===3?"Một phần đã rõ, còn cách hiểu khác nhau":"Mức bạn ghi nhận: "+understanding+"/5"}</b></div><div className="form-stack"><label>Dấu hiệu nào cho thấy mức độ này?<textarea defaultValue="Ba đơn vị diễn đạt được tác động tới kế hoạch; hai đơn vị chưa nêu thay đổi cụ thể."/></label></div></>}
    {step===3&&<><div className="card-heading"><Pill tone="coral">03 · ACTION</Pill><h2>Cuộc họp đã tạo ra hành động gì?</h2><p>Ghi đủ việc, người chịu trách nhiệm và thời điểm kiểm tra.</p></div><div className="action-table"><div className="action-head"><span>Hành động</span><span>Owner</span><span>Thời hạn</span></div><div><input defaultValue="Cập nhật danh sách cơ hội ưu tiên"/><input defaultValue="Phòng KHDN"/><input type="date" defaultValue="2026-07-31"/></div><div><input defaultValue="Chốt phương án phối hợp bán chéo"/><input defaultValue="Phòng Bán lẻ"/><input type="date" defaultValue="2026-08-03"/></div></div><button className="secondary small"><Plus/>Thêm action</button></>}
    {step===4&&<><div className="card-heading"><Pill tone="coral">04 · ĐIỀU HỌC ĐƯỢC</Pill><h2>Bạn muốn giữ lại điều gì?</h2><p>Cả điều đã phát huy và một điều muốn thử khác đi.</p></div><div className="form-stack"><label>Điểm bạn đã làm tốt<textarea defaultValue="Dành khoảng trống để từng đơn vị tự diễn đạt tác động thay vì giải thích thay."/></label><label>Điều rút ra từ trải nghiệm này<textarea defaultValue="Xác nhận “đã rõ” chưa đủ để biết thông điệp đã chuyển thành ưu tiên hành động."/></label><label>Thử nghiệm nhỏ cho lần tới<textarea defaultValue="Mời từng đơn vị trả lời bằng một thay đổi cụ thể trong kế hoạch tuần."/></label></div></>}
    {step===5&&<><div className="card-heading"><Pill tone="coral">05 · XÁC NHẬN</Pill><h2>Một giả thuyết để bạn cân nhắc</h2><p>AI không kết luận về bạn. Bạn quyết định điều này có đúng với trải nghiệm hay không.</p></div><div className="insight-card"><div><Eye/><b>Quan sát</b><p>Trong cuộc họp này, câu hỏi về tác động đã làm xuất hiện hai cách hiểu ưu tiên khác nhau.</p></div><div><Lightbulb/><b>Diễn giải</b><p>Có vẻ như câu hỏi yêu cầu người tham gia diễn đạt lại giúp kiểm chứng mức “thông” tốt hơn câu hỏi xác nhận chung.</p></div><div><Target/><b>Gợi ý</b><p>Nếu phù hợp, bạn có thể tiếp tục thử câu hỏi về một thay đổi cụ thể trong kế hoạch ở cuộc giao ban tới.</p></div></div><div className="confirm-box"><b>Nhận định này có phù hợp với trải nghiệm của bạn?</b><div><button className={confirmed===true?"selected":""} onClick={()=>setConfirmed(true)}><Check/>Phù hợp</button><button className={confirmed===false?"selected":""} onClick={()=>setConfirmed(false)}><X/>Chưa phù hợp</button></div><small>Chỉ insight bạn xác nhận mới được ghi vào Nhật ký phát triển.</small></div></>}
    <div className="wizard-actions"><button className="secondary" onClick={()=>step>1?setStep(step-1):onCancel()}><ArrowLeft/>Quay lại</button><span>Bước {step}/{labels.length}</span><button className="primary" disabled={step===5&&confirmed===null} onClick={()=>step<5?setStep(step+1):onDone()}>{step<5?"Tiếp tục":"Hoàn tất Review"}{step<5?<ArrowRight/>:<Check/>}</button></div>
  </div></div>
}

function JournalPage({entries}) {
  const [query,setQuery]=useState(""), [selected,setSelected]=useState(null);
  const filtered=entries.filter(x=>x.title.toLowerCase().includes(query.toLowerCase()));
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">HÀNH TRÌNH CỦA BẠN</span><h1>Nhật ký điều phối</h1><p>Nhìn lại những gì đã diễn ra, không phải để chấm điểm bản thân.</p></div><div className="stat"><b>6</b><span>cuộc họp<br/>đã nhìn lại</span></div><div className="stat magenta"><b>2</b><span>thử nghiệm<br/>đã thực hành</span></div></div><Notice/>
    <div className="journal-layout"><section><div className="toolbar"><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm theo tên cuộc họp..."/></div><select><option>Tất cả loại cuộc họp</option>{types.map(x=><option>{x}</option>)}</select></div><div className="timeline">{filtered.map((e,i)=><div className="timeline-item" key={e.id}><div className="timeline-dot"/><div className="date">{e.date}</div><button className={`journal-card ${selected?.id===e.id?"selected":""}`} onClick={()=>setSelected(e)}><div><Pill tone="green">INSIGHT ĐÃ XÁC NHẬN</Pill><h3>{e.title}</h3></div><ChevronRight/><p><b>Quan sát:</b> {e.observation}</p><div className="experiment-line"><Lightbulb/><span><b>Thử nghiệm tiếp theo</b>{e.experiment}</span></div></button></div>)}</div></section>
      <aside className="growth-panel"><div className="icon-orb purple"><Sparkles/></div><h2>Dấu hiệu phát triển</h2><p>Qua các lần nhìn lại, bạn đang tạo thêm không gian để người tham gia tự diễn đạt cách hiểu.</p><div className="evidence"><span>MINH CHỨNG GẦN ĐÂY</span><p>2 cuộc họp dùng câu hỏi về tác động</p><p>1 điểm hiểu khác được phát hiện sớm</p></div><small>Đây là diễn giải từ những quan sát bạn đã xác nhận, không phải đánh giá năng lực.</small></aside>
    </div>
    {selected&&<div className="modal-back" onClick={()=>setSelected(null)}><div className="modal detail-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setSelected(null)}><X/></button><Pill tone="green">NHẬT KÝ PHÁT TRIỂN</Pill><h2>{selected.title}</h2><p className="muted">{selected.date}</p><Summary icon={Eye} title="Điều đã quan sát" text={selected.observation}/><Summary icon={HeartHandshake} title="Điểm đã phát huy" text={selected.behavior}/><Summary icon={BookOpen} title="Điều rút ra" text={selected.lesson}/><Summary icon={Lightbulb} title="Thử nghiệm tiếp theo" text={selected.experiment}/></div></div>}
  </div>
}

function FeedbackPage() {const [sent,setSent]=useState(false); return <div className="page narrow-page"><div className="page-heading simple"><div><span className="eyebrow">CÙNG PHÁT TRIỂN SẢN PHẨM</span><h1>Góp ý cho Healthier VietinBank</h1><p>Chia sẻ trải nghiệm để ứng dụng hữu ích hơn trong công việc thực tế.</p></div></div><Notice/><div className="two-cards"><section className="panel-card"><h2>Gửi góp ý mới</h2>{sent?<div className="success"><div><Check/></div><h3>Cảm ơn bạn đã chia sẻ!</h3><p>Đội ngũ phát triển đã ghi nhận góp ý này.</p><button className="secondary" onClick={()=>setSent(false)}>Gửi góp ý khác</button></div>:<div className="form-stack"><label>Loại góp ý<select><option>Gợi ý tính năng</option><option>Nội dung chưa hữu ích</option><option>Lỗi ứng dụng</option><option>Góp ý khác</option></select></label><label>Bạn muốn chia sẻ điều gì?<textarea placeholder="Mô tả tình huống và điều bạn mong đợi..." rows="7"/></label><button className="primary" onClick={()=>setSent(true)}>Gửi góp ý<ArrowRight/></button></div>}</section><section className="panel-card"><h2>Góp ý đã gửi</h2><div className="feedback-history">{mockFeedback.slice(0,1).map(f=><div><div><Pill tone="cyan">{f.category}</Pill><small>{f.date}</small></div><p>{f.message}</p><span>Trạng thái: <b>{f.status}</b></span></div>)}</div></section></div></div>}

function AccountPage({user}) {return <div className="page narrow-page"><div className="page-heading simple"><div><span className="eyebrow">HỒ SƠ CÁ NHÂN</span><h1>Tài khoản</h1><p>Quản lý thông tin và dữ liệu của bạn.</p></div></div><div className="account-grid"><section className="panel-card profile-card"><div className="profile-avatar">{user.name.split(" ").slice(-2).map(x=>x[0]).join("")}</div><h2>{user.name}</h2><p>@{user.userAD}</p><Pill>{user.role}</Pill><hr/><div><span>Phiên bản</span><b>Local mock · 0.1.0</b></div><div><span>Lần hoạt động gần nhất</span><b>Hôm nay, 09:42</b></div></section><section className="panel-card"><h2>Bảo mật</h2><div className="setting-row"><LockKeyhole/><span><b>Mã PIN cá nhân</b><small>6 chữ số · Chỉ bạn cần ghi nhớ</small></span><button className="secondary small">Đổi PIN</button></div><div className="setting-row"><ShieldCheck/><span><b>Đăng nhập trên thiết bị này</b><small>Phiên không giới hạn thời gian</small></span></div><h2 className="subhead">Dữ liệu của bạn</h2><div className="setting-row danger"><Trash2/><span><b>Yêu cầu xóa dữ liệu</b><small>Ẩn ngay trong ứng dụng, xóa dữ liệu hoạt động trong 30 ngày.</small></span><button className="danger-btn">Yêu cầu xóa</button></div><p className="fineprint">Ứng dụng không hỗ trợ xuất dữ liệu. Bản mẫu local hiện chỉ lưu dữ liệu giả trên trình duyệt này.</p></section></div></div>}

function AdminPage() {const [tab,setTab]=useState("overview"); return <div className="page admin-page"><div className="page-heading simple"><div><span className="eyebrow">HEALTHIER VIETINBANK</span><h1>Admin Console</h1><p>Theo dõi sử dụng, góp ý và vận hành dữ liệu.</p></div><Pill tone="purple">QUYỀN CHỦ SỞ HỮU</Pill></div><div className="admin-tabs">{[["overview","Tổng quan"],["users","Người dùng"],["feedback","Góp ý"],["pin","Đặt lại PIN"],["ops","Vận hành"]].map(x=><button className={tab===x[0]?"active":""} onClick={()=>setTab(x[0])}>{x[1]}</button>)}</div>
  {tab==="overview"&&<><div className="metric-grid"><Metric title="Người dùng" value="128" sub="+14 trong 30 ngày"/><Metric title="Hoạt động 30 ngày" value="76" sub="59% tổng người dùng"/><Metric title="Cuộc họp đã tạo" value="342" sub="214 đã Review"/><Metric title="Góp ý mới" value="7" sub="Cần xem xét"/></div><div className="admin-grid"><section className="panel-card"><h2>Hoạt động 7 ngày gần đây</h2><div className="bars">{[34,52,41,68,58,82,72].map((x,i)=><div><i style={{height:x+"%"}}/><span>{["T2","T3","T4","T5","T6","T7","CN"][i]}</span></div>)}</div></section><section className="panel-card"><h2>Tình trạng hệ thống</h2><Status label="Vercel application" value="Hoạt động"/><Status label="Google Sheets API" value="Hoạt động"/><Status label="Backup cuối tháng" value="Lần cuối: 30/06/2026"/><Status label="Yêu cầu xóa chờ xử lý" value="2 yêu cầu" warn/></section></div></>}
  {tab==="users"&&<section className="panel-card table-card"><div className="section-head"><div><h2>Người dùng ứng dụng</h2><p>Admin chỉ theo dõi danh tính và trạng thái sử dụng.</p></div><div className="search"><Search/><input placeholder="Tìm userAD..."/></div></div><div className="data-table"><div><b>Người dùng</b><b>Vị trí</b><b>Hoạt động gần nhất</b><b>Trạng thái</b><b/></div>{mockUsers.map(u=><div><span><strong>{u.name}</strong><small>@{u.userAD}</small></span><span>{u.role}</span><span>{u.lastActive}</span><Pill tone={u.status.includes("khóa")?"coral":"green"}>{u.status}</Pill><button className="icon-btn"><ChevronRight/></button></div>)}</div></section>}
  {tab==="feedback"&&<section className="panel-card table-card"><h2>Góp ý từ người dùng</h2><div className="feedback-admin">{mockFeedback.map(f=><div><div><Pill tone="cyan">{f.category}</Pill><span>{f.date}</span></div><h3>@{f.userAD}</h3><p>{f.message}</p><select defaultValue={f.status}><option>Mới</option><option>Đang xem xét</option><option>Đã xử lý</option></select></div>)}</div></section>}
  {tab==="pin"&&<section className="panel-card pin-panel"><div className="icon-orb purple"><LockKeyhole/></div><h2>Hỗ trợ đặt lại PIN</h2><p>Chỉ thực hiện sau khi người dùng liên hệ trực tiếp tới <b>healthiervtb@vietinbank.vn</b> và được Admin xác minh.</p><Notice/><div className="form-grid"><label>userAD cần hỗ trợ<input placeholder="Ví dụ: minhanh.n"/></label><label>Lý do xác minh<select><option>Đã liên hệ qua email nội bộ</option><option>Xác minh trực tiếp</option></select></label></div><button className="primary">Tạo PIN tạm 48 giờ</button><small>Hệ thống buộc người dùng đổi PIN khi đăng nhập bằng PIN tạm.</small></section>}
  {tab==="ops"&&<section className="panel-card"><h2>Vận hành dữ liệu</h2><Status label="Users Sheet" value="Kết nối"/><Status label="Meetings & Learning Sheet" value="Kết nối"/><Status label="Feedback & Operations Sheet" value="Kết nối"/><Status label="Bản backup cuối tháng" value="Giữ 12 tháng"/><Status label="Xóa vĩnh viễn" value="Trong 30 ngày"/><div className="ops-note"><ShieldCheck/><p><b>Bản mẫu local</b><br/>Trang này đang mô phỏng trạng thái. Chưa có dữ liệu nào được gửi tới Google Sheets.</p></div></section>}
  </div>}
function Metric({title,value,sub}) {return <div className="metric"><span>{title}</span><b>{value}</b><small>{sub}</small></div>}
function Status({label,value,warn}) {return <div className="status-row"><span><i className={warn?"warn":""}/>{label}</span><b>{value}</b></div>}

export default function App() {
  const saved=()=>{try{return JSON.parse(localStorage.getItem("hvtb-session"))}catch{return null}};
  const [user,setUser]=useState(saved), [consented,setConsented]=useState(()=>localStorage.getItem("hvtb-consent")==="yes");
  const [page,setPage]=useState("home"), [review,setReview]=useState(null), [meetings,setMeetings]=useState(initialMeetings), [toast,setToast]=useState("");
  useEffect(()=>{if(user)localStorage.setItem("hvtb-session",JSON.stringify(user));else localStorage.removeItem("hvtb-session")},[user]);
  useEffect(()=>{if(user?.userAD && user.userAD!=="minhanh.n" && user.userAD!=="admin.vtb" && user.name==="Nguyễn Minh Anh")setUser({...user,name:user.userAD})},[user?.userAD]);
  const notify=t=>{setToast(t);setTimeout(()=>setToast(""),2800)};
  if(!user)return <Login onLogin={u=>setUser(u)}/>;
  if(!consented)return <Consent onCancel={()=>setUser(null)} onAccept={()=>{localStorage.setItem("hvtb-consent","yes");setConsented(true)}}/>;
  const donePrepare=f=>{setMeetings([{id:"new",title:f.title,type:f.type,date:"06/08/2026",status:"prepared",statusLabel:"Đã chuẩn bị",purpose:f.purpose},...meetings]);notify("Đã lưu bản chuẩn bị vào nhật ký.");setPage("home")};
  return <Shell user={user} page={page} setPage={setPage} onLogout={()=>setUser(null)}>
    {page==="home"&&<HomePage user={user} setPage={setPage} meetings={meetings} startReview={setReview}/>}
    {page==="prepare"&&<PreparePage onDone={donePrepare}/>}
    {page==="journal"&&<JournalPage entries={journalEntries}/>}
    {page==="feedback"&&<FeedbackPage/>}{page==="account"&&<AccountPage user={user}/>}
    {page==="admin"&&<AdminPage/>}
    {review&&<ReviewPage meeting={review} onCancel={()=>setReview(null)} onDone={()=>{setReview(null);notify("Review đã được lưu vào Nhật ký phát triển.");setPage("journal")}}/>}
    {toast&&<div className="toast"><Check/>{toast}</div>}
  </Shell>
}
