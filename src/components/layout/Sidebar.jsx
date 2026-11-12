const groups=[['WORKSPACE',['Borrowing blotter','Locate requests','Reservations','Active loans']],['TRADING',['Trading']],['TREASURY',['Collateral','Margin calls','Funding & account','Fees & rebates']],['OPERATIONS',['Returns & recalls','Agreements','Reports & audit']]]

export default function Sidebar({page,onNavigate}) {
 return (<aside className="side"><div className="brand"><b>B</b> BorrowDesk</div>{groups.map(([g,items])=><section key={g}><small>{g}</small>{items.map((name,i)=><button className={page===name?'active':''} onClick={()=>onNavigate(name)} key={name}><span>{['☷','⌕','▣','▱','↗','◇','⚖','▤','◉','↶','▤','▥'][groups.flatMap(x=>x[1]).indexOf(name)]}</span>{name}{name==='Margin calls'&&<em>2</em>}{name==='Returns & recalls'&&<em>3</em>}</button>)}</section>)}<div className="profile"><b>NV</b><span>Niranjan V.<small>Operations</small></span></div></aside>)
}
