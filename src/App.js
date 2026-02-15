import { useState, useEffect, useRef } from "react";

/* ── Palette ── */
const C = {
  saffron: "#FF6B00", gold: "#FFD700", magenta: "#FF0080",
  teal: "#00C9B1", deepTeal: "#007A6E", sky: "#00D4FF",
  indigo: "#4B0082", violet: "#8B00FF", lime: "#AAFF00",
  pink: "#FF69B4", orange: "#FF4500", cream: "#FFF8E7",
  bg: "#0A0500",
};

/* ── Data ── */
const TONES = [
  { value:"funny and warm",                        label:"😄 Funny & Warm"          },
  { value:"roasting and savage",                   label:"🔥 Roasting & Savage"      },
  { value:"cheesy and punny",                      label:"🧀 Cheesy & Punny"         },
  { value:"heartfelt but sneaks in a joke at end", label:"💛 Heartfelt with a Twist" },
  { value:"completely absurd and surreal",         label:"🌀 Completely Absurd"      },
];
const NAMES   = ["Priya","Raj","Arjun","Sunita","Vikram","Meena","Rohan","Aunty Ji","Deepika","Amit","Pooja","Dadi"];
const AGES    = [18,21,25,30,35,40,45,50,60,70];
const HOBBIES = ["binge-watching reality TV","competitive napping","collecting things they never use",
  "giving unsolicited advice","talking to their plants","attending every party possible","arguing about films",
  "cooking elaborate meals that take all day","doing yoga only when others are watching",
  "buying books they will never read","scrolling social media and calling it research","training for a 5k they will never run"];

/* ──────────────────────────────────────────────
   SVG PEACOCK — body + animated fan feathers
   featherOpen: 0 = closed, 1 = fully open
────────────────────────────────────────────── */
const PeacockSVG = ({ size = 220, featherOpen = 0, style = {} }) => {
  const numFeathers = 18;
  const fanR = 80;
  // feathers spread from -110° to +110° when open, collapsed to ~-10° to +10° when closed
  const spreadAngle = featherOpen * 110;

  return (
    <svg width={size} height={size} viewBox="0 0 220 220" style={style}>
      <defs>
        <radialGradient id="eyeGrad" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#00D4FF"/>
          <stop offset="40%"  stopColor="#007A6E"/>
          <stop offset="70%"  stopColor="#4B0082"/>
          <stop offset="100%" stopColor="#00C9B1"/>
        </radialGradient>
        <radialGradient id="bodyGrad" cx="40%" cy="40%">
          <stop offset="0%"   stopColor="#00E5CC"/>
          <stop offset="60%"  stopColor="#007A6E"/>
          <stop offset="100%" stopColor="#004D45"/>
        </radialGradient>
        <radialGradient id="headGrad" cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#00D4FF"/>
          <stop offset="100%" stopColor="#007A6E"/>
        </radialGradient>
      </defs>

      {/* ── Fan feathers (behind body) ── */}
      {Array.from({ length: numFeathers }, (_, i) => {
        const norm   = numFeathers === 1 ? 0 : i / (numFeathers - 1);
        const angle  = -spreadAngle + norm * spreadAngle * 2 - 90;
        const rad    = angle * Math.PI / 180;
        const pivotX = 110, pivotY = 148;
        const tip    = fanR * featherOpen * 0.97 + 14;
        const ex = pivotX + tip * Math.cos(rad);
        const ey = pivotY + tip * Math.sin(rad);
        // feather colour cycle
        const col = [C.teal, C.sky, C.indigo, C.violet, C.magenta, C.gold, C.saffron][i % 7];
        const eyeCol = [C.sky, C.gold, C.teal, C.magenta, C.violet][i % 5];
        const stemLen = tip * 0.88;
        const sx = pivotX + stemLen * Math.cos(rad);
        const sy = pivotY + stemLen * Math.sin(rad);

        // bezier control points for curved feather
        const perpX = -Math.sin(rad) * 18 * featherOpen;
        const perpY =  Math.cos(rad) * 18 * featherOpen;
        const mx = pivotX + (stemLen * 0.55) * Math.cos(rad);
        const my = pivotY + (stemLen * 0.55) * Math.sin(rad);

        return (
          <g key={i}>
            {/* stem */}
            <path
              d={`M ${pivotX} ${pivotY} Q ${mx + perpX} ${my + perpY} ${sx} ${sy}`}
              stroke={col} strokeWidth={featherOpen > 0.05 ? 1.2 : 0.5}
              fill="none" opacity={0.5 + featherOpen * 0.45}
            />
            {/* eye of feather */}
            {featherOpen > 0.15 && (
              <g opacity={featherOpen}>
                <ellipse cx={ex} cy={ey}
                  rx={6 * featherOpen} ry={9 * featherOpen}
                  fill={col} opacity={0.85}
                  transform={`rotate(${angle + 90},${ex},${ey})`}
                />
                <ellipse cx={ex} cy={ey}
                  rx={3.5 * featherOpen} ry={5.5 * featherOpen}
                  fill={eyeCol} opacity={0.9}
                  transform={`rotate(${angle + 90},${ex},${ey})`}
                />
                <circle cx={ex} cy={ey} r={1.8 * featherOpen} fill="#001A10" opacity={0.95}/>
                <circle cx={ex - featherOpen} cy={ey - featherOpen * 1.2} r={0.7 * featherOpen} fill="#fff" opacity={0.9}/>
              </g>
            )}
          </g>
        );
      })}

      {/* ── Body ── */}
      <ellipse cx="110" cy="158" rx="18" ry="28" fill="url(#bodyGrad)"/>
      {/* wing highlights */}
      <ellipse cx="97"  cy="162" rx="9"  ry="16" fill={C.teal}   opacity="0.45" transform="rotate(-12,97,162)"/>
      <ellipse cx="123" cy="162" rx="9"  ry="16" fill={C.sky}    opacity="0.45" transform="rotate(12,123,162)"/>
      {/* belly pattern */}
      {[0,1,2].map(i=>(
        <ellipse key={i} cx="110" cy={155+i*6} rx={7-i*1.5} ry="3"
          fill={C.gold} opacity="0.55"/>
      ))}

      {/* ── Neck ── */}
      <path d="M 104 132 Q 106 115 110 108 Q 114 115 116 132 Z"
        fill="url(#headGrad)" opacity="0.95"/>
      {/* neck detail lines */}
      {[0,1,2].map(i=>(
        <path key={i} d={`M ${107+i} ${130} Q ${108+i} ${118} ${110} ${112}`}
          stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5"/>
      ))}

      {/* ── Head ── */}
      <circle cx="110" cy="103" r="11" fill="url(#headGrad)"/>
      <circle cx="110" cy="103" r="7"  fill={C.sky} opacity="0.4"/>

      {/* crest feathers */}
      {[-12, -5, 0, 5, 12].map((dx, i) => (
        <g key={i}>
          <line x1={110+dx*0.4} y1="96" x2={110+dx} y2={82 - (i===2?5:0)}
            stroke={C.gold} strokeWidth="1.2" opacity="0.9"/>
          <circle cx={110+dx} cy={81-(i===2?5:0)} r={i===2?2.5:1.8}
            fill={[C.magenta,C.saffron,C.gold,C.saffron,C.magenta][i]} opacity="0.95"/>
        </g>
      ))}

      {/* ── Eye ── */}
      <ellipse cx="114" cy="101" rx="4.5" ry="3.5" fill="#001A10"/>
      <ellipse cx="114" cy="101" rx="3"   ry="2.5" fill="url(#eyeGrad)"/>
      <circle  cx="114" cy="101" r="1.5"  fill="#001A10"/>
      <circle  cx="115" cy="100" r="0.6"  fill="#fff"/>

      {/* ── Beak ── */}
      <path d="M 119 103 L 126 104 L 119 106 Z" fill={C.gold} opacity="0.95"/>

      {/* ── Feet ── */}
      <line x1="104" y1="183" x2="101" y2="196" stroke={C.gold} strokeWidth="1.5"/>
      <line x1="116" y1="183" x2="119" y2="196" stroke={C.gold} strokeWidth="1.5"/>
      {[[-5,0],[0,0],[4,-3]].map(([dx,dy],i)=>(
        <line key={i} x1="101" y1="196" x2={96+i*4+dx} y2={200+dy} stroke={C.gold} strokeWidth="1.2"/>
      ))}
      {[[-5,0],[0,0],[4,-3]].map(([dx,dy],i)=>(
        <line key={i} x1="119" y1="196" x2={114+i*4+dx} y2={200+dy} stroke={C.gold} strokeWidth="1.2"/>
      ))}
    </svg>
  );
};

/* ── Animated Peacock wrapper ── */
const AnimatedPeacock = ({ trigger, size = 220, style = {} }) => {
  const [open, setOpen] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    start.current = null;
    const duration = 1400;
    const animate = (ts) => {
      if (!start.current) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setOpen(eased);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [trigger]);

  return <PeacockSVG size={size} featherOpen={open} style={style} />;
};

/* ── Ornamental border ── */
const OrnaBorder = () => (
  <svg width="100%" height="22" viewBox="0 0 600 22" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="ob" x="0" y="0" width="50" height="22" patternUnits="userSpaceOnUse">
        <polygon points="25,2 36,11 25,20 14,11" fill={C.saffron} opacity="0.9"/>
        <polygon points="25,5 33,11 25,17 17,11" fill={C.gold}    opacity="0.8"/>
        <circle cx="25" cy="11" r="3"  fill={C.magenta} opacity="0.95"/>
        <circle cx="4"  cy="11" r="3"  fill={C.teal}    opacity="0.8"/>
        <circle cx="46" cy="11" r="3"  fill={C.teal}    opacity="0.8"/>
        <circle cx="4"  cy="11" r="1.5" fill={C.gold}   opacity="1"/>
        <circle cx="46" cy="11" r="1.5" fill={C.gold}   opacity="1"/>
        <line x1="7"  y1="11" x2="14" y2="11" stroke={C.gold} strokeWidth="1" opacity="0.7"/>
        <line x1="36" y1="11" x2="43" y2="11" stroke={C.gold} strokeWidth="1" opacity="0.7"/>
        <line x1="0"  y1="3"  x2="50" y2="3"  stroke={C.saffron} strokeWidth="0.5" opacity="0.4"/>
        <line x1="0"  y1="19" x2="50" y2="19" stroke={C.saffron} strokeWidth="0.5" opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="100%" height="22" fill="url(#ob)"/>
  </svg>
);

/* ── Mandala bg decoration ── */
const Mandala = ({ size = 130, op = 0.15 }) => {
  const rings = [
    { r:52, n:20, rx:5,  ry:13, fill:C.saffron },
    { r:38, n:14, rx:4,  ry:11, fill:C.magenta  },
    { r:25, n:10, rx:4,  ry: 9, fill:C.teal     },
    { r:14, n: 7, rx:3,  ry: 7, fill:C.gold     },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 110 110">
      {Array.from({length:28},(_,i)=>{
        const a=i*12.86*Math.PI/180;
        return <circle key={i} cx={55+52*Math.cos(a)} cy={55+52*Math.sin(a)} r="2" fill={C.gold} opacity={op+0.2}/>;
      })}
      {rings.map((rg,ri)=>
        Array.from({length:rg.n},(_,i)=>{
          const a=i*(360/rg.n)*Math.PI/180;
          const cx=55+rg.r*Math.cos(a), cy=55+rg.r*Math.sin(a);
          return <ellipse key={`${ri}-${i}`} cx={cx} cy={cy} rx={rg.rx} ry={rg.ry}
            fill={rg.fill} opacity={op+0.1}
            transform={`rotate(${i*(360/rg.n)+90},${cx},${cy})`}/>;
        })
      )}
      {Array.from({length:8},(_,i)=>{
        const a=i*45*Math.PI/180;
        return <ellipse key={i} cx={55+9*Math.cos(a)} cy={55+9*Math.sin(a)} rx="3" ry="8"
          fill={C.saffron} opacity={op+0.35}
          transform={`rotate(${i*45+90},${55+9*Math.cos(a)},${55+9*Math.sin(a)})`}/>;
      })}
      <circle cx="55" cy="55" r="6"   fill={C.gold}    opacity={op+0.6}/>
      <circle cx="55" cy="55" r="3"   fill={C.magenta} opacity={op+0.75}/>
    </svg>
  );
};

const Lotus = ({ size=55, op=0.2 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {Array.from({length:10},(_,i)=>{
      const a=i*36*Math.PI/180, r=28, cx=50+r*Math.cos(a), cy=50+r*Math.sin(a);
      return <ellipse key={i} cx={cx} cy={cy} rx="6" ry="16"
        fill={[C.magenta,C.saffron,C.teal,C.gold,C.sky][i%5]}
        opacity={op+0.12} transform={`rotate(${i*36+90},${cx},${cy})`}/>;
    })}
    {Array.from({length:6},(_,i)=>{
      const a=i*60*Math.PI/180, r=14, cx=50+r*Math.cos(a), cy=50+r*Math.sin(a);
      return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="10"
        fill={[C.gold,C.sky,C.violet][i%3]}
        opacity={op+0.2} transform={`rotate(${i*60+90},${cx},${cy})`}/>;
    })}
    <circle cx="50" cy="50" r="8" fill={C.gold}    opacity={op+0.5}/>
    <circle cx="50" cy="50" r="4" fill={C.saffron} opacity={op+0.7}/>
  </svg>
);

const Paisley = ({ size=40, op=0.18, rotate=0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform:`rotate(${rotate}deg)`}}>
    <path d="M50 88 C18 82 8 52 22 30 C33 12 58 10 66 26 C76 46 62 66 46 63 C34 60 30 44 40 36 C48 30 58 36 55 46 C53 52 46 51 46 46"
      fill="none" stroke={C.magenta} strokeWidth="3" opacity={op+0.4}/>
    <path d="M50 88 C18 82 8 52 22 30 C33 12 58 10 66 26 C76 46 62 66 46 63"
      fill={C.saffron} opacity={op*0.35}/>
    <circle cx="50" cy="90" r="5" fill={C.gold} opacity={op+0.55}/>
    {[0,72,144,216,288].map((a,i)=>(
      <circle key={i} cx={50+12*Math.cos(a*Math.PI/180)} cy={50+12*Math.sin(a*Math.PI/180)} r="2"
        fill={[C.gold,C.saffron,C.magenta,C.teal,C.sky][i]} opacity={op+0.45}/>
    ))}
  </svg>
);

const Star8 = ({ size=48, op=0.16 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {[0,45].map((ba,bi)=>(
      <polygon key={bi} points={Array.from({length:4},(_,j)=>{
        const a=(j*90+ba)*Math.PI/180;
        return `${50+40*Math.cos(a)},${50+40*Math.sin(a)}`;
      }).join(' ')} fill={bi===0?C.teal:C.magenta} opacity={op+0.15} stroke={C.gold} strokeWidth="1"/>
    ))}
    {[10,20,32].map((r,i)=>(
      <polygon key={i} points={Array.from({length:6},(_,j)=>{
        const a=(j*60+i*12)*Math.PI/180;
        return `${50+r*Math.cos(a)},${50+r*Math.sin(a)}`;
      }).join(' ')} fill="none" stroke={[C.gold,C.saffron,C.magenta][i]} strokeWidth="1.5" opacity={op+0.35}/>
    ))}
    <circle cx="50" cy="50" r="7" fill={C.gold} opacity={op+0.6}/>
  </svg>
);

const Diya = ({ size=36, op=0.26 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <ellipse cx="50" cy="74" rx="36" ry="17" fill={C.orange}   opacity={op+0.25}/>
    <ellipse cx="50" cy="68" rx="28" ry="13" fill={C.saffron}  opacity={op+0.2}/>
    <ellipse cx="50" cy="64" rx="20" ry="9"  fill="#7B3200"    opacity={op+0.5}/>
    <path d="M50 54 Q46 38 50 20 Q54 38 50 54Z" fill={C.gold}      opacity={op+0.7}/>
    <path d="M50 48 Q48 37 50 26 Q52 37 50 48Z" fill="#FFFACD"     opacity={op+0.85}/>
    <ellipse cx="50" cy="54" rx="5" ry="3.5" fill={C.saffron}  opacity={op+0.5}/>
  </svg>
);

/* ── Background scatter layout ── */
const BG_ITEMS = [
  ...Array.from({length:5}, (_,i)=>({ T:"mandala", x:(i*193+5)%92,  y:(i*137+8)%88,  s:100+(i%3)*30, op:0.13+(i%3)*0.03, d:i*0.8 })),
  ...Array.from({length:7}, (_,i)=>({ T:"lotus",   x:(i*157+12)%90, y:(i*83+18)%86,  s:50+(i%3)*18,  op:0.15+(i%3)*0.04, d:i*0.55})),
  ...Array.from({length:8}, (_,i)=>({ T:"paisley", x:(i*111+7)%93,  y:(i*79+5)%90,   s:38+(i%4)*10,  op:0.14+(i%3)*0.04, r:i*37,  d:i*0.45})),
  ...Array.from({length:7}, (_,i)=>({ T:"star8",   x:(i*173+3)%94,  y:(i*61+25)%86,  s:42+(i%3)*14,  op:0.12+(i%3)*0.03, d:i*0.65})),
  ...Array.from({length:6}, (_,i)=>({ T:"diya",    x:(i*97+15)%88,  y:(i*143+10)%84, s:30+(i%3)*10,  op:0.2+(i%3)*0.05,  d:i*0.5 })),
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
export default function BirthdayCardGenius() {
  const [name,    setName]    = useState("");
  const [age,     setAge]     = useState("");
  const [hobby,   setHobby]   = useState("");
  const [tone,    setTone]    = useState(TONES[0].value);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lucky,   setLucky]   = useState(false);
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);
  const [confetti,setConfetti]= useState([]);
  const [showPeacock, setShowPeacock] = useState(false);
  const [peacockTrigger, setPeacockTrigger] = useState(0);

  const boom = () => {
    const cols = [C.saffron, C.gold, C.magenta, C.teal, C.sky, C.violet, C.lime, C.pink, "#fff", C.orange];
    setConfetti(Array.from({length:80},(_,i)=>({
      id:i, left:Math.random()*100, color:cols[i%cols.length],
      delay:Math.random()*1.5, size:5+Math.random()*10,
      dur:1.8+Math.random()*1.5, round:Math.random()>0.35,
      dx:(Math.random()-0.5)*80,
    })));
    setTimeout(()=>setConfetti([]),5000);
  };

  const triggerPeacock = () => {
    setShowPeacock(true);
    setPeacockTrigger(t => t + 1);
    setTimeout(() => setShowPeacock(false), 4000);
  };

  const celebrate = () => { boom(); triggerPeacock(); };

  const callAI = async (n, a, h, t) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1000,
        system: `You are a witty birthday card writer with a warm sense of humour.
Write punchy, funny, personal birthday messages in 3-5 sentences.
Use the person's hobby as the comedic backbone.
Don't start with "Happy Birthday" — build up to it or subvert the cliche.
Output ONLY the birthday message — no quotes, no label, no preamble.`,
        messages: [{ role:"user", content:`Write a ${t} birthday card message for ${n}, who is turning ${a} and loves ${h}.` }]
      })
    });
    const d = await r.json();
    const txt = d?.content?.[0]?.text;
    if (!txt) throw new Error("empty");
    return txt;
  };

  const generate = async () => {
    setError("");
    if (!name.trim() || !age.trim() || !hobby.trim()) { setError("Please fill in name, age, and hobby first!"); return; }
    setLoading(true); setMessage("");
    try { setMessage(await callAI(name, age, hobby, tone)); celebrate(); }
    catch { setError("Oops! Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const goLucky = async () => {
    setError("");
    const n = NAMES[Math.floor(Math.random()*NAMES.length)];
    const a = String(AGES[Math.floor(Math.random()*AGES.length)]);
    const h = HOBBIES[Math.floor(Math.random()*HOBBIES.length)];
    const t = TONES[Math.floor(Math.random()*TONES.length)];
    setName(n); setAge(a); setHobby(h); setTone(t.value); setMessage("");
    setLucky(true);
    try { setMessage(await callAI(n, a, h, t.value)); celebrate(); }
    catch { setError("Oops! Something went wrong. Please try again."); }
    finally { setLucky(false); }
  };

  const copy = () => {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  const busy = loading || lucky;

  const inp = {
    width:"100%", background:"rgba(5,2,0,0.8)", backdropFilter:"blur(8px)",
    border:`2px solid ${C.gold}`, borderRadius:8, color:C.cream,
    fontFamily:"'Lora', Georgia, serif", fontSize:"0.97rem",
    padding:"0.65rem 0.95rem", transition:"border-color 0.2s, box-shadow 0.2s",
  };
  const lbl = {
    display:"block", fontSize:"0.7rem", textTransform:"uppercase",
    letterSpacing:"0.12em", color:C.gold,
    marginBottom:"0.35rem", fontWeight:700, fontFamily:"'DM Sans', sans-serif",
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(ellipse at 20% 20%, #1A0A00 0%, #000D08 40%, #0D0015 70%, #0A0500 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"0 1rem 4rem", position:"relative", overflow:"hidden",
    }}>

      {/* ── CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;600&display=swap');
        @keyframes fall{0%{opacity:1;transform:translateY(0) rotate(0deg) translateX(0)}100%{opacity:0;transform:translateY(110vh) rotate(900deg) translateX(var(--dx,0px))}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes wobble{0%,100%{transform:rotate(-5deg) scale(1)}50%{transform:rotate(5deg) scale(1.06)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes sway{0%,100%{transform:translate(-50%,-50%) rotate(-3deg)}50%{transform:translate(-50%,-50%) rotate(3deg)}}
        @keyframes divaGlow{0%,100%{box-shadow:0 0 18px rgba(255,215,0,0.45),0 0 0 0 rgba(255,107,0,0.2)}50%{box-shadow:0 0 42px rgba(255,215,0,0.8),0 0 0 10px rgba(255,107,0,0.07)}}
        @keyframes borderFlow{0%,100%{opacity:0.75}50%{opacity:1}}
        @keyframes shimmerTitle{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes peacockEntry{0%{opacity:0;transform:translateX(-50%) scale(0.5)}60%{opacity:1;transform:translateX(-50%) scale(1.05)}100%{opacity:1;transform:translateX(-50%) scale(1)}}
        @keyframes peacockExit{0%{opacity:1;transform:translateX(-50%) scale(1)}100%{opacity:0;transform:translateX(-50%) scale(0.7) translateY(30px)}}
        .gen-btn:hover:not(:disabled){filter:brightness(1.2) saturate(1.2)!important;transform:translateY(-2px)!important}
        .gen-btn:active:not(:disabled){transform:translateY(0)!important}
        .lucky-btn:hover:not(:disabled){filter:brightness(1.25)!important;transform:translateY(-2px) scale(1.02)!important}
        .outline-btn:hover{border-color:${C.gold}!important;color:${C.gold}!important;background:rgba(255,215,0,0.08)!important}
        input:focus,select:focus{outline:none;border-color:${C.saffron}!important;box-shadow:0 0 0 3px rgba(255,107,0,0.3)!important}
        input::placeholder{color:rgba(255,180,60,0.3)!important}
        select option{background:#100500;color:${C.cream}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:${C.gold};border-radius:3px}
      `}</style>

      {/* ── Confetti ── */}
      {confetti.map(p=>(
        <div key={p.id} style={{
          "--dx":`${p.dx}px`,
          position:"fixed", left:`${p.left}vw`, top:-20,
          width:p.size, height:p.size, background:p.color,
          borderRadius:p.round?"50%":2, zIndex:400,
          animation:`fall ${p.dur}s ease-in ${p.delay}s both`, pointerEvents:"none",
          boxShadow:`0 0 ${p.size}px ${p.color}88`,
        }}/>
      ))}

      {/* ── Peacock celebration overlay ── */}
      {showPeacock && (
        <div style={{
          position:"fixed", bottom:"10%", left:"50%",
          zIndex:350, pointerEvents:"none",
          animation:`peacockEntry 0.6s ease both`,
          filter:`drop-shadow(0 0 20px ${C.teal}) drop-shadow(0 0 40px ${C.magenta})`,
        }}>
          <AnimatedPeacock trigger={peacockTrigger} size={240}/>
        </div>
      )}

      {/* ── Background motifs ── */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {BG_ITEMS.map((item,i)=>(
          <div key={i} style={{
            position:"absolute", left:`${item.x}%`, top:`${item.y}%`,
            transform:"translate(-50%,-50%)",
            animation:`sway ${5+i%3}s ease-in-out ${item.d}s infinite`,
          }}>
            {item.T==="mandala" && <Mandala  size={item.s} op={item.op}/>}
            {item.T==="lotus"   && <Lotus    size={item.s} op={item.op}/>}
            {item.T==="paisley" && <Paisley  size={item.s} op={item.op} rotate={item.r||0}/>}
            {item.T==="star8"   && <Star8    size={item.s} op={item.op}/>}
            {item.T==="diya"    && <Diya     size={item.s} op={item.op}/>}
          </div>
        ))}
        {/* Seated peacocks in corners */}
        {[
          { x:"4%",   y:"12%", s:90,  flipX:false, op:0.28 },
          { x:"92%",  y:"12%", s:90,  flipX:true,  op:0.28 },
          { x:"6%",   y:"72%", s:75,  flipX:false, op:0.22 },
          { x:"91%",  y:"72%", s:75,  flipX:true,  op:0.22 },
        ].map((p,i)=>(
          <div key={i} style={{
            position:"absolute", left:p.x, top:p.y,
            opacity:p.op, pointerEvents:"none",
            transform:`translateX(-50%) ${p.flipX?"scaleX(-1)":""}`,
            filter:`drop-shadow(0 0 6px ${C.teal})`,
            animation:`sway ${6+i}s ease-in-out ${i*1.2}s infinite`,
          }}>
            <PeacockSVG size={p.s} featherOpen={0.35}/>
          </div>
        ))}
      </div>

      {/* Colour glow blobs */}
      <div style={{position:"fixed",top:-200,left:-200,width:700,height:700,background:`radial-gradient(circle,rgba(255,107,0,0.1),transparent 70%)`,borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-200,right:-200,width:600,height:600,background:`radial-gradient(circle,rgba(0,201,177,0.08),transparent 70%)`,borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"40%",right:-100,width:400,height:400,background:`radial-gradient(circle,rgba(255,0,128,0.07),transparent 70%)`,borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"20%",left:"40%",width:500,height:500,background:`radial-gradient(circle,rgba(75,0,130,0.06),transparent 70%)`,borderRadius:"50%",pointerEvents:"none",zIndex:0}}/>

      {/* ── TOP BANNER ── */}
      <div style={{width:"100%",zIndex:10,marginBottom:"1.5rem",position:"sticky",top:0}}>
        <OrnaBorder/>
        <div style={{
          background:"linear-gradient(90deg,#1A0500,#2A0D00,#1A0500)",
          borderBottom:`2px solid ${C.gold}`,
          padding:"0.5rem 1rem",
          display:"flex",alignItems:"center",justifyContent:"center",gap:"0.9rem",
        }}>
          {["✦","🌸","🪔","✦","🦚","✦","🪔","🌸","✦"].map((s,i)=>(
            <span key={i} style={{
              color:[C.gold,C.saffron,C.magenta,C.teal,C.sky,C.gold,C.saffron,C.magenta,C.teal][i],
              fontSize:s==="🦚"?"1.3rem":"0.9rem", opacity:0.9,
              textShadow:`0 0 8px currentColor`,
            }}>{s}</span>
          ))}
        </div>
        <div style={{transform:"scaleY(-1)"}}><OrnaBorder/></div>
      </div>

      {/* ── Main ── */}
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:620}}>

        {/* ── HEADER ── */}
        <div style={{textAlign:"center",marginBottom:"2rem",animation:"fadeUp 0.6s ease both"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.7rem",marginBottom:"0.6rem"}}>
            <div style={{flex:1,height:"2px",background:`linear-gradient(to right,transparent,${C.saffron},${C.gold})`}}/>
            <span style={{color:C.gold,fontSize:"1.2rem",letterSpacing:"0.15em",textShadow:`0 0 14px ${C.gold}`}}>✦ 🦚 ✦</span>
            <div style={{flex:1,height:"2px",background:`linear-gradient(to left,transparent,${C.saffron},${C.gold})`}}/>
          </div>

          <div style={{fontSize:"3.4rem",display:"block",marginBottom:"0.25rem",
            animation:"wobble 2.5s ease-in-out infinite",
            filter:`drop-shadow(0 0 12px ${C.saffron}) drop-shadow(0 0 24px ${C.magenta})`}}>🎊</div>

          <h1 style={{
            fontFamily:"'Playfair Display', Georgia, serif",
            fontSize:"clamp(2.1rem,6vw,3.2rem)", fontWeight:900,
            background:`linear-gradient(135deg,${C.gold},${C.saffron},${C.magenta},${C.sky},${C.teal},${C.gold})`,
            backgroundSize:"300% 300%",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            animation:"shimmerTitle 3.5s linear infinite",
            margin:"0 0 0.3rem", lineHeight:1.1,
            filter:"drop-shadow(0 2px 8px rgba(255,107,0,0.3))",
          }}>Birthday Card Genius</h1>

          <p style={{color:C.gold,fontSize:"0.9rem",fontFamily:"'DM Sans',sans-serif",
            letterSpacing:"0.08em",opacity:0.85,textShadow:`0 0 10px ${C.gold}`}}>
            Fill in the details — we'll write the laughs ✦
          </p>
        </div>

        {/* ── FORM CARD ── */}
        <div style={{
          background:"rgba(8,3,0,0.92)", backdropFilter:"blur(18px)",
          borderRadius:18, overflow:"hidden",
          boxShadow:`0 0 0 2px ${C.gold}, 0 0 80px rgba(255,107,0,0.2), 0 0 40px rgba(0,201,177,0.12), 0 16px 48px rgba(0,0,0,0.9)`,
          marginBottom:"1.2rem", animation:"fadeUp 0.7s 0.1s ease both",
        }}>
          <OrnaBorder/>
          <div style={{padding:"1.6rem 2rem"}}>
            <div style={{height:3,borderRadius:2,
              background:`linear-gradient(90deg,${C.teal},${C.saffron},${C.gold},${C.magenta},${C.sky},${C.teal})`,
              marginBottom:"1.4rem",opacity:0.9,animation:"borderFlow 2.5s ease-in-out infinite"}}/>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
              <div>
                <label style={lbl}>Their Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Priya" maxLength={40} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Turning Age</label>
                <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="e.g. 30" min={1} max={120} style={inp}/>
              </div>
            </div>

            <div style={{marginBottom:"1rem"}}>
              <label style={lbl}>Hobby / Passion</label>
              <input type="text" value={hobby} onChange={e=>setHobby(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&generate()}
                placeholder="e.g. gardening, binge-watching reality TV, competitive napping…"
                maxLength={80} style={inp}/>
            </div>

            <div style={{marginBottom:"1.4rem"}}>
              <label style={lbl}>Tone</label>
              <select value={tone} onChange={e=>setTone(e.target.value)} style={{...inp,cursor:"pointer"}}>
                {TONES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {error && <p style={{color:"#FF8060",fontSize:"0.85rem",marginBottom:"0.8rem",fontFamily:"'DM Sans',sans-serif",animation:"fadeUp 0.3s ease"}}>⚠️ {error}</p>}

            {/* Generate button */}
            <button className="gen-btn" disabled={busy} onClick={generate} style={{
              width:"100%", padding:"0.95rem 1.5rem", border:"none", borderRadius:12,
              background: loading
                ? `linear-gradient(135deg,#4a1000,#6b0030)`
                : `linear-gradient(135deg,${C.saffron},${C.orange},${C.magenta})`,
              color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", fontWeight:700,
              cursor:busy?"not-allowed":"pointer", letterSpacing:"0.04em",
              boxShadow:`0 4px 24px rgba(255,107,0,0.55), 0 0 0 1px ${C.gold}`,
              transition:"transform 0.15s,filter 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
              opacity:busy&&!loading?0.45:1, marginBottom:"0.8rem",
              textShadow:"0 1px 3px rgba(0,0,0,0.4)",
            }}>
              {loading
                ? <><span style={{width:19,height:19,border:"2.5px solid rgba(255,255,255,0.35)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Crafting magic…</>
                : "✨ Generate Birthday Message"}
            </button>

            {/* Feeling Lucky */}
            <button className="lucky-btn" disabled={busy} onClick={goLucky} style={{
              width:"100%", padding:"0.9rem 1.5rem",
              border:`2.5px solid ${C.gold}`, borderRadius:12,
              background: lucky
                ? "rgba(80,60,0,0.5)"
                : `linear-gradient(135deg,rgba(0,201,177,0.12),rgba(75,0,130,0.15),rgba(0,212,255,0.1))`,
              color:C.gold, fontFamily:"'DM Sans',sans-serif", fontSize:"0.95rem", fontWeight:700,
              cursor:busy?"not-allowed":"pointer", letterSpacing:"0.04em",
              animation:!busy?"divaGlow 2.5s ease-in-out infinite":"none",
              transition:"transform 0.15s, filter 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
              opacity:busy&&!lucky?0.45:1,
              textShadow:`0 0 10px ${C.gold}`,
            }}>
              {lucky
                ? <><span style={{width:18,height:18,border:`2.5px solid rgba(255,215,0,0.35)`,borderTopColor:C.gold,borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Summoning fate…</>
                : "🪔 I'm Feeling Lucky — Surprise Me!"}
            </button>

            {!busy && <p style={{textAlign:"center",color:"rgba(255,200,80,0.3)",fontSize:"0.73rem",marginTop:"0.5rem",fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>
              Randomly picks a name, age, hobby &amp; tone — then writes the card!
            </p>}

            <div style={{height:3,borderRadius:2,
              background:`linear-gradient(90deg,${C.teal},${C.gold},${C.magenta},${C.saffron},${C.sky},${C.teal})`,
              marginTop:"1.5rem",opacity:0.8,animation:"borderFlow 2.5s 1.2s ease-in-out infinite"}}/>
          </div>
          <OrnaBorder/>
        </div>

        {/* ── RESULT CARD ── */}
        {message && (
          <div style={{
            background:"rgba(8,3,0,0.93)", backdropFilter:"blur(18px)",
            borderRadius:18, overflow:"hidden",
            boxShadow:`0 0 0 2px ${C.gold}, 0 0 80px rgba(0,201,177,0.18), 0 16px 48px rgba(0,0,0,0.9)`,
            animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            <OrnaBorder/>
            <div style={{padding:"1.6rem 2rem"}}>
              <div style={{height:3,borderRadius:2,
                background:`linear-gradient(90deg,${C.sky},${C.teal},${C.gold},${C.magenta},${C.saffron},${C.sky})`,
                marginBottom:"1.2rem",opacity:0.9}}/>

              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1rem"}}>
                <span style={{color:C.gold,fontFamily:"'DM Sans',sans-serif",fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.14em",fontWeight:700,textShadow:`0 0 8px ${C.gold}`}}>
                  🎊 Your Birthday Message
                </span>
                {name && <span style={{color:"rgba(255,200,80,0.4)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.7rem"}}>for {name}, turning {age}</span>}
                <div style={{flex:1,height:1,background:`linear-gradient(to right,${C.gold}66,transparent)`}}/>
              </div>

              <p style={{
                fontFamily:"'Lora', Georgia, serif",
                fontSize:"clamp(1.05rem,2.6vw,1.28rem)",
                fontStyle:"italic", lineHeight:1.85,
                color:C.cream, whiteSpace:"pre-wrap", margin:0,
                textShadow:"0 1px 10px rgba(255,107,0,0.12)",
              }}>{message}</p>

              <div style={{display:"flex",gap:"0.8rem",marginTop:"1.4rem"}}>
                {[{label:copied?"✅ Copied!":"📋 Copy",fn:copy},{label:"🔄 Regenerate",fn:generate}].map(b=>(
                  <button key={b.label} className="outline-btn" onClick={b.fn} disabled={busy} style={{
                    flex:1, padding:"0.65rem 1rem", borderRadius:8,
                    border:`1.5px solid ${C.gold}88`, background:"transparent",
                    color:C.gold, fontFamily:"'DM Sans',sans-serif",
                    fontSize:"0.88rem", cursor:busy?"not-allowed":"pointer",
                    transition:"all 0.2s", opacity:busy?0.45:1, fontWeight:600,
                  }}>{b.label}</button>
                ))}
              </div>

              <div style={{height:3,borderRadius:2,
                background:`linear-gradient(90deg,${C.sky},${C.teal},${C.gold},${C.magenta},${C.saffron},${C.sky})`,
                marginTop:"1.2rem",opacity:0.7}}/>
            </div>
            <OrnaBorder/>
          </div>
        )}

        <div style={{textAlign:"center",marginTop:"1.6rem",opacity:0.4,letterSpacing:"0.3em",color:C.gold,fontSize:"1.1rem",textShadow:`0 0 10px ${C.gold}`}}>
          ✦ 🦚 ❋ 🪷 ❋ 🦚 ✦
        </div>
      </div>
    </div>
  );
}