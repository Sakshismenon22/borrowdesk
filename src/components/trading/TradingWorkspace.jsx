import {useEffect,useMemo,useRef,useState} from 'react'
import {createChart,CandlestickSeries,HistogramSeries} from 'lightweight-charts'
import {demoAccount,demoSecurities,demoWatchlist} from '../../data/demoData'
import {api} from '../../services/apiClient'
import {borrowerRequest} from '../../services/borrowerService'
import {getSecurityMaster,getCurrentPrices,getHistoricalCandles} from '../../services/marketDataService'

const unwrap=x=>x?.data??x
const rows=x=>{const d=unwrap(x);return Array.isArray(d)?d:Array.isArray(d?.content)?d.content:Array.isArray(d?.items)?d.items:[]}
const n=x=>Number(x??0)
const money=x=>'₹'+n(x).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})
const security=x=>({...x,id:x?.id??x?.securityId,symbol:x?.symbol??x?.ticker??'—',name:x?.name??x?.securityName??x?.companyName??x?.symbol??'Unknown security',isin:x?.isin??x?.ISIN??x?.isinCode,exchange:x?.exchange??'NSE',price:x?.price==null&&x?.lastPrice==null&&x?.close==null?0:n(x?.price??x?.lastPrice??x?.close),change:n(x?.change??x?.priceChange),changePercent:n(x?.changePercent??x?.changePct),volume:x?.volume??x?.tradedVolume??'—',borrowedAvailable:x?.borrowedAvailable??x?.availableQuantity??'—'})
const symbolOf=x=>String(x?.symbol??x?.ticker??x?.securitySymbol??x?.security?.symbol??'').toUpperCase()
async function loadMarketUniverse(borrowerApi,marketApi){
 const [masterRaw,priceRaw,borrowerRaw]=await Promise.all([
  getSecurityMaster(marketApi),
  getCurrentPrices(marketApi),
  borrowerRequest(borrowerApi,'/api/v1/securities')
 ])
 const prices=rows(priceRaw),borrowers=rows(borrowerRaw)
 const priceById=new Map(prices.map(p=>[String(p.security?.id??p.securityId??p.security?.securityId),p]))
 const borrowerBySymbol=new Map(borrowers.map(x=>[symbolOf(x),x]))
 const securities=rows(masterRaw).map(master=>{
  const price=priceById.get(String(master.id))
  const borrower=borrowerBySymbol.get(symbolOf(master))
  const open=n(price?.open),close=n(price?.close)
  return security({...master,price:price?.close,open:price?.open,high:price?.high,low:price?.low,volume:price?.volume,change:close-open,changePercent:open?(close-open)/open*100:0,borrowerSecurityId:borrower?.id??borrower?.securityId})
 })
 return securities
}
const candle=x=>{const raw=x.tradedDateTimestamp??x.timestamp??x.time??x.date;let time=typeof raw==='number'?(raw>1e12?Math.floor(raw/1000):raw):Math.floor(new Date(raw).getTime()/1000);return {time,open:n(x.open??x.o??x.openPrice??x.open_price),high:n(x.high??x.h??x.highPrice??x.high_price),low:n(x.low??x.l??x.lowPrice??x.low_price),close:n(x.close??x.c??x.closePrice??x.close_price),volume:n(x.volume??x.v??0)}}
const demoCash=demoAccount.availableCash
const demoHoldings=demoAccount.positions
function makeDemoCandles(p){const start=Date.parse('2026-11-12T09:15:00+05:30')/1000;const data=Array.from({length:166},(_,i)=>{const trend=1609.4+i*.137;const wave=Math.sin(i*.34)*2.15+Math.sin(i*.91)*.72;const next=1609.4+(i+1)*.137+Math.sin((i+1)*.34)*2.15+Math.sin((i+1)*.91)*.72;const open=trend+wave;const close=next;return {time:start+i*60,open,close,high:Math.max(open,close)+.75+Math.abs(Math.sin(i*.51))*.8,low:Math.min(open,close)-.65-Math.abs(Math.cos(i*.39))*.7,volume:12500+Math.round(11500*Math.abs(Math.sin(i*.27)))}});data[data.length-1]={time:start+165*60,open:1629.80,high:1634.20,low:1628.50,close:1632.50,volume:18200};return data}
function aggregateCandles(data,period){const seconds=period==='5m'?300:period==='15m'?900:period==='1h'?3600:period==='1D'?86400:60;const offset=period==='1D'?19800:0;const buckets=new Map();for(const item of data){const bucket=Math.floor((item.time+offset)/seconds)*seconds-offset;const prior=buckets.get(bucket);if(!prior)buckets.set(bucket,{...item,time:bucket});else{prior.high=Math.max(prior.high,item.high);prior.low=Math.min(prior.low,item.low);prior.close=item.close;prior.volume+=item.volume||0}}return [...buckets.values()].sort((a,b)=>a.time-b.time)}

export default function TradingWorkspace({mode,org,borrowerApi,marketApi}){
 const [chartLoading,ChartLoading]=useState(false),[universe,U]=useState([]),[watch,W]=useState([]),[query,Q]=useState(''),[selected,S]=useState(null),[candles,K]=useState([]),[interval,I]=useState('5m'),[side,Side]=useState('BUY'),[type,Type]=useState('MARKET'),[source,Source]=useState('OWNED'),[qty,Qty]=useState('1000'),[limit,Limit]=useState(''),[orders,O]=useState([]),[trades,T]=useState([]),[cash,Cash]=useState(mode==='DEMO'?demoCash:0),[holdings,H]=useState(mode==='DEMO'?demoHoldings:[]),[tab,Tab]=useState('Open orders'),[error,E]=useState(''),[toast,Toast]=useState(''),[busy,B]=useState(false),[review,Review]=useState(true)
 const base=borrowerApi+'/api/v1/organizations/'+org
 const isDemo=mode==='DEMO'
 const loadChart=async(item,period=interval)=>{if(!item)return;ChartLoading(true);try{if(isDemo){K(aggregateCandles(makeDemoCandles(item.price),period));return}const raw=await getHistoricalCandles(marketApi,item.symbol,item.exchange||'NSE');const history=rows(raw).map(candle).filter(x=>Number.isFinite(x.time)&&x.open>0&&x.high>0&&x.low>0&&x.close>0).sort((a,b)=>a.time-b.time);const unique=[...new Map(history.map(x=>[x.time,x])).values()];K(aggregateCandles(unique,period));if(!unique.length)E('No historical candles found for '+item.symbol+' on '+(item.exchange||'NSE')+'.')}catch(e){K([]);E('Market data history unavailable: '+e.message+' — check VITE_MARKET_API and market-data-service.')}finally{ChartLoading(false)}}
 useEffect(()=>{let alive=true;B(true);E('');if(isDemo){const all=demoSecurities.map(security);const wl=demoWatchlist.map(security);U(all);W(wl);S(all.find(x=>x.symbol==='INFY')||wl[0]||all[0]||null);O([{id:'OD-000784',createdAt:'11:56:21',symbol:'INFY',side:'BUY',type:'LIMIT',source:'OWNED',quantity:1000,limitPrice:1625,status:'PENDING'},{id:'OD-000783',createdAt:'11:49:02',symbol:'RELIANCE',side:'SELL',type:'LIMIT',source:'BORROWED',quantity:500,limitPrice:2900,status:'PENDING'},{id:'OD-000782',createdAt:'11:41:37',symbol:'ICICIBANK',side:'BUY',type:'LIMIT',source:'OWNED',quantity:1500,limitPrice:1445,status:'PENDING'}]);T([]);Cash(demoCash);H(demoHoldings);B(false);return()=>{alive=false}}
 Promise.all([loadMarketUniverse(borrowerApi,marketApi),api('',base+'/watchlist'),api('',base+'/orders?size=100'),api('',base+'/trades?size=100'),api('',base+'/account')]).then(([securitiesRaw,w,o,t,a])=>{if(!alive)return;const securities=securitiesRaw;const bySymbol=new Map(securities.map(x=>[x.symbol.toUpperCase(),x]));const byBorrowerId=new Map(securities.filter(x=>x.borrowerSecurityId!=null).map(x=>[String(x.borrowerSecurityId),x]));const watchlist=rows(w).map(x=>bySymbol.get(symbolOf(x))||byBorrowerId.get(String(x.id??x.securityId))||security(x));U(securities);W(watchlist);S(watchlist[0]||securities[0]||null);O(rows(o));T(rows(t));const account=unwrap(a)||{};Cash(n(account.availableCash??account.available_cash??account.cashBalance??account.balance));H(Array.isArray(account.positions)?account.positions:Array.isArray(account.holdings)?account.holdings:[])}).catch(e=>alive&&E(e.message+' — verify market-data-service security master/current prices, borrower service, and organization ID.')).finally(()=>alive&&B(false));return()=>{alive=false}},[mode,org,borrowerApi,marketApi])
 useEffect(()=>{if(selected)loadChart(selected,interval)},[selected?.id,mode,interval,marketApi])
 const filtered=useMemo(()=>universe.filter(x=>[x.name,x.symbol,x.isin].some(v=>String(v||'').toLowerCase().includes(query.trim().toLowerCase()))),[universe,query])
 const inWatch=x=>watch.some(w=>String(w.id)===String(x.id))
 const choose=x=>{S(x);E('')}
 const toggleWatch=async x=>{const exists=inWatch(x);if(!isDemo&&!x.borrowerSecurityId){E('No matching borrower security ID was found for '+x.symbol+'. The market-data record is visible, but watchlist updates require a borrower security mapping.');return}if(isDemo){W(old=>exists?old.filter(v=>String(v.id)!==String(x.id)):[...old,x]);return}try{await api(base,'/watchlist/'+(x.borrowerSecurityId??x.id),exists?'DELETE':'PUT');W(old=>exists?old.filter(v=>String(v.id)!==String(x.id)):[...old,x])}catch(e){E('Watchlist update failed: '+e.message)}}
 const refresh=async()=>{if(isDemo){Toast('Demo market data refreshed.');return}B(true);try{const [u,w,o,t,a]=await Promise.all([loadMarketUniverse(borrowerApi,marketApi),api(base,'/watchlist'),api(base,'/orders?size=100'),api(base,'/trades?size=100'),api(base,'/account')]);const bySymbol=new Map(u.map(x=>[x.symbol.toUpperCase(),x]));const byBorrowerId=new Map(u.filter(x=>x.borrowerSecurityId!=null).map(x=>[String(x.borrowerSecurityId),x]));U(u);W(rows(w).map(x=>bySymbol.get(symbolOf(x))||byBorrowerId.get(String(x.id??x.securityId))||security(x)));O(rows(o));T(rows(t));const acc=unwrap(a)||{};Cash(n(acc.availableCash??acc.available_cash??acc.cashBalance??acc.balance));Toast('Trading data refreshed.')}catch(e){E(e.message)}finally{B(false)}}
 const submit=async e=>{e.preventDefault();if(!selected)return E('Select a security before placing an order.');if(!review)return E('Confirm the order review checkbox before submission.');if(!isDemo&&!selected.borrowerSecurityId)return E('No matching borrower security ID was found for '+selected.symbol+'. Cannot submit an order until the security masters are mapped.');const payload={securityId:Number(isDemo?selected.id:selected.borrowerSecurityId),side,type,source,quantity:Number(qty),...(type==='LIMIT'?{limitPrice:Number(limit)}:{})};try{if(isDemo){O(old=>[{id:'OD-'+String(Date.now()).slice(-6),createdAt:new Date().toLocaleTimeString('en-IN'),symbol:selected.symbol,...payload,status:'PENDING'},...old]);Toast('Simulated '+side.toLowerCase()+' order added to Open orders.')}else{const result=unwrap(await api(base,'/orders','POST',payload));O(old=>[result,...old]);Toast('Order submitted to the backend paper-trading engine.')}}catch(e){E('Order submission failed: '+e.message)}}
 const cancel=async order=>{if(isDemo){O(old=>old.map(x=>x.id===order.id?{...x,status:'CANCELLED'}:x));return}try{await api(base,'/orders/'+(order.id??order.orderId)+'/cancel','POST');O(old=>old.map(x=>(x.id??x.orderId)===(order.id??order.orderId)?{...x,status:'CANCELLED'}:x))}catch(e){E('Unable to cancel order: '+e.message)}}
 const openOrders=orders.filter(x=>/pending|open|new|partially/i.test(String(x.status||'')))
 const owned=holdings.filter(x=>/owned/i.test(String(x.source??x.positionSource??'owned'))).reduce((a,x)=>a+n(x.quantity??x.ownedQuantity),0)
 const borrowed=holdings.filter(x=>/borrow/i.test(String(x.source??x.positionSource??''))).reduce((a,x)=>a+n(x.quantity??x.settledQuantity),0)
 const estimate=(type==='LIMIT'?n(limit):n(selected?.price))*n(qty)
 const displayRows=tab==='Open orders'?openOrders:tab==='Trades'?trades:tab==='Positions'?holdings:holdings
 return <div className={'trading-page '+(isDemo?'demo-trading-page':'')}>
  <div className="trading-titlebar"><div><h1>Trading</h1><p>Monitor securities and place simulated orders</p></div><div className="trade-title-actions"><span className="trade-mode-note">{busy?'● Loading…':isDemo?'● Demo market data': '● Backend data'}</span><span className="available-cash">Available cash <b>{money(cash)}</b></span>{!isDemo&&<button className="watchlist-menu" onClick={()=>document.getElementById('watchlist-search')?.focus()}>★ Watchlist⌄</button>}</div></div>
  <div className="trade-disclaimer">ⓘ Simulated execution · completed-minute prices</div>
  {error&&<div className="error">{error}<button onClick={()=>E('')}>×</button></div>}{toast&&<div className="toast">{toast}</div>}
  <div className="dealing-layout">
   <section className="watchlist-panel">
    <div className="trade-panel-head"><b>Watchlist</b>{!isDemo&&<select aria-label="Watchlist selector"><option>My watchlist</option></select>}<button title="Focus security search" onClick={()=>document.getElementById('watchlist-search')?.focus()}>＋</button></div>
    <div className="watch-search"><span>⌕</span><input id="watchlist-search" value={query} onChange={e=>Q(e.target.value)} placeholder="Find or add security"/></div>
    {query&&<div className="watch-search-results">{filtered.slice(0,8).map(x=><div key={x.id} className="watch-search-row"><button className="security-pick" onClick={()=>choose(x)}><b>{x.symbol}</b><small>{x.name} · {x.isin||'ISIN n/a'}</small></button><button title={inWatch(x)?'Remove from watchlist':'Add to watchlist'} onClick={()=>toggleWatch(x)}>{inWatch(x)?'✓':'＋'}</button><button title="View chart" onClick={()=>choose(x)}>⌁</button></div>)}{!filtered.length&&<div className="empty">No matching securities</div>}</div>}
    <div className="watchlist-grid"><div className="watchlist-colhead"><b>Security</b><b>Price (₹)</b><b>{isDemo?'Change %':'1m change %'}</b></div>{watch.map(x=><button key={x.id} className={'watchlist-row '+(selected?.id===x.id?'active':'')} onClick={()=>choose(x)}><span><b>★</b><strong>{x.symbol} · {x.exchange}</strong><small>{x.name}</small></span><strong>{money(x.price)}</strong><b className={x.changePercent>=0?'positive':'negative'}>{x.changePercent>0?'+':''}{x.changePercent.toFixed(2)}%</b></button>)}{!watch.length&&<div className="empty">Search and add securities to your watchlist.</div>}</div>
    <div className="watchlist-foot">{watch.length} securities</div>
   </section>
   <section className="market-panel">
    <div className="trade-panel-head market-head"><b>Securities</b><label>Exchange <select><option>NSE</option><option>BSE</option><option>All</option></select></label><div className="market-search"><span>⌕</span><input value={query} onChange={e=>Q(e.target.value)} placeholder="Search symbol or company"/></div><button title="Refresh market data" onClick={refresh}>↻</button></div>
    <div className="securities-grid"><table><thead><tr><th>☆</th><th>Security</th><th>Last price (₹)</th><th>{isDemo?'Change %':'1m change %'}</th><th>Volume</th></tr></thead><tbody>{filtered.slice(0,30).map(x=><tr key={x.id} className={selected?.id===x.id?'chosen':''} onClick={()=>choose(x)}><td><button className="star-button" onClick={e=>{e.stopPropagation();toggleWatch(x)}}>{inWatch(x)?'★':'☆'}</button></td><td><b>{x.symbol} · {x.exchange}</b><small>{x.name} · {x.isin||'ISIN unavailable'}</small></td><td>{money(x.price)}</td><td className={x.changePercent>=0?'positive':'negative'}>{x.changePercent>0?'+':''}{x.changePercent.toFixed(2)}%</td><td>{x.volume??'—'}</td></tr>)}</tbody></table>{!filtered.length&&<div className="empty">No securities match your search.</div>}</div>
    <div className="chart-panel">
     {selected?<><div className="chart-heading"><div><b>{selected.symbol} · {selected.exchange}</b><small>{selected.name}</small></div><div className="chart-price"><b>{money(selected.price)}</b><small className={isDemo?'positive':selected.change>=0?'positive':'negative'}>{isDemo?'Day change · ':'1m change · '}{selected.change>=0?'+':''}{money(Math.abs(selected.change))} ({selected.changePercent>=0?'+':''}{selected.changePercent.toFixed(2)}%)</small></div><span className="delayed-pill">Delayed / simulated</span><div className="intervals">{['1m','5m','15m','1h','1D'].map(x=><button key={x} className={interval===x?'selected':''} onClick={()=>I(x)}>{x}</button>)}</div><button className="icon-button" onClick={()=>loadChart(selected)}>↻</button></div><div className="ohlc-line">O {money(candles.at(-1)?.open||selected.price)}　H {money(candles.at(-1)?.high||selected.price)}　L {money(candles.at(-1)?.low||selected.price)}　C {money(candles.at(-1)?.close||selected.price)}　·　{isDemo?'Demo candles':'Market-data-service'}{chartLoading?' · Loading…':''}</div><LightweightCandleChart rows={candles} timezone={isDemo?'Asia/Kolkata':undefined}/></>:<div className="empty chart-empty">Select a security to view its candlestick chart and trade ticket.</div>}
    </div>
   </section>
   <aside className="order-ticket">
    <h2>Order ticket</h2><div className="ticket-instrument"><b>{selected?selected.symbol+' · '+selected.exchange:'Select security'}</b><span>Last price <strong>{selected?money(selected.price):'—'}</strong></span></div>
    <form onSubmit={submit}>
     <div className="side-switch"><button type="button" className={side==='BUY'?'buy-active':''} onClick={()=>Side('BUY')}>BUY</button><button type="button" className={side==='SELL'?'sell-active':''} onClick={()=>Side('SELL')}>SELL</button></div>
     <div className="ticket-field-row"><label>Order type<select value={type} onChange={e=>Type(e.target.value)}><option value="MARKET">Market</option><option value="LIMIT">Limit</option></select></label></div>
     <label className="ticket-field">Position source<select value={source} onChange={e=>Source(e.target.value)}><option value="OWNED">Owned</option><option value="BORROWED">Borrowed</option></select></label>
     <label className="ticket-field">Quantity<div className="quantity-control"><input type="number" min="1" step="1" value={qty} onChange={e=>Qty(e.target.value)} required/><button type="button" onClick={()=>Qty(String(Math.max(1,n(qty)-100)))}>−</button><button type="button" onClick={()=>Qty(String(n(qty)+100))}>＋</button></div></label>
     <label className="ticket-field">Limit price<input type="number" min="0.01" step="0.01" placeholder="Market price" value={limit} disabled={type==='MARKET'} onChange={e=>Limit(e.target.value)} required={type==='LIMIT'}/></label>
     <div className="ticket-summary"><div><span>Available cash</span><b>{money(cash)}</b></div><div><span>Estimated value</span><b>{money(estimate)}</b></div><div><span>Remaining cash</span><b>{money(cash-(side==='BUY'?estimate:0))}</b></div></div>
     <div className="inventory-summary"><div><small>Owned shares</small><b>{owned.toLocaleString('en-IN')||'0'}</b></div><div><small>Settled borrowed shares</small><b>{borrowed.toLocaleString('en-IN')||'0'}</b></div></div>
     <p className="ticket-info">ⓘ Borrowed SELL uses settled borrowed shares. Borrowed BUY covers an open short.</p><p className="ticket-info">ⓘ Market orders use the cached completed-minute close.</p>
     <label className="review-check"><input type="checkbox" checked={review} onChange={e=>Review(e.target.checked)}/> Review order before submission</label>
     <div className="ticket-actions"><button className="place-order" disabled={!selected||!qty||n(qty)<=0|| (type==='LIMIT'&&n(limit)<=0)}>Place simulated {side.toLowerCase()}</button><button type="button" className="reset-order" onClick={()=>{Side('BUY');Type('MARKET');Source('OWNED');Qty('1000');Limit('');Review(true)}}>Reset</button></div>
    </form>
   </aside>
  </div>
  <section className="trade-bottom">
   <div className="trade-bottom-tabs">{['Open orders','Trades','Positions','Holdings'].map(x=><button key={x} className={tab===x?'active':''} onClick={()=>Tab(x)}>{x}{x==='Open orders'?' ('+openOrders.length+')':''}</button>)}</div>
   <div className="bottom-grid-wrap">{tab==='Open orders'?<table><thead><tr><th></th><th>Order ID</th><th>Time</th><th>Security</th><th>Side</th><th>Type</th><th>Source</th><th>Qty</th><th>Limit price (₹)</th><th>Status</th><th>Action</th></tr></thead><tbody>{displayRows.map(x=><tr key={x.id??x.orderId}><td>›</td><td>{x.id??x.orderId}</td><td>{x.createdAt??x.time??'—'}</td><td><b>{x.symbol??x.securitySymbol??x.securityId??'—'}</b></td><td><span className={'side-tag '+String(x.side).toLowerCase()}>{x.side}</span></td><td>{x.type}</td><td>{x.source==='BORROWED'?'Borrowed':'Owned'}</td><td>{x.quantity}</td><td>{x.limitPrice?money(x.limitPrice):'—'}</td><td><span className="status-tag">{x.status}</span></td><td>{/pending|open|new/i.test(x.status||'')?<button className="cancel-link" onClick={()=>cancel(x)}>Cancel</button>:'—'}</td></tr>)}</tbody></table>:tab==='Trades'?<table><thead><tr><th>Trade ID</th><th>Time</th><th>Security</th><th>Side</th><th>Qty</th><th>Price (₹)</th><th>Value (₹)</th><th>Status</th></tr></thead><tbody>{trades.map(x=><tr key={x.id??x.tradeId}><td>{x.id??x.tradeId}</td><td>{x.executedAt??x.time??'—'}</td><td>{x.symbol??x.securitySymbol??x.securityId}</td><td>{x.side}</td><td>{x.quantity}</td><td>{money(x.price??x.executionPrice)}</td><td>{money(x.value??n(x.quantity)*n(x.price??x.executionPrice))}</td><td>{x.status??'FILLED'}</td></tr>)}</tbody></table>:<table><thead><tr><th>Security</th><th>Position source</th><th>Quantity</th><th>Market value (₹)</th></tr></thead><tbody>{displayRows.map((x,i)=><tr key={x.id??x.securityId??i}><td>{x.symbol??x.securitySymbol??x.securityId??'—'}</td><td>{x.source??x.positionSource??(tab==='Holdings'?'Owned':'—')}</td><td>{x.quantity??x.ownedQuantity??x.settledQuantity??'—'}</td><td>{money(x.marketValue??x.value??0)}</td></tr>)}</tbody></table>}{!displayRows.length&&<div className="empty">No {tab.toLowerCase()} to display.</div>}</div>
  </section>
  <div className="trade-statusbar"><span>● {isDemo?'Demo data loaded':'Borrower service '+(error?'needs attention':'connected')}</span><span>● Market data {busy?'loading':'available'}</span><span>● Paper execution</span><span>Last updated {new Date().toLocaleTimeString('en-IN')}</span></div>
 </div>
}
function LightweightCandleChart({rows,timezone}){
 const host=useRef(null),chartRef=useRef(null),seriesRef=useRef(null),volumeRef=useRef(null)
 useEffect(()=>{
  if(!host.current)return
  const chart=createChart(host.current,{
   autoSize:false,width:host.current.clientWidth,height:210,
   layout:{background:{type:'solid',color:'#ffffff'},textColor:'#596270',attributionLogo:true},
   grid:{vertLines:{color:'#eef0f3'},horzLines:{color:'#eef0f3'}},
   rightPriceScale:{borderColor:'#e1e5ea'},
   timeScale:{borderColor:'#e1e5ea',timeVisible:true,secondsVisible:false,...(timezone?{timezone}: {})},
   crosshair:{vertLine:{color:'#c8cdd4'},horzLine:{color:'#c8cdd4'}}
  })
  const series=chart.addSeries(CandlestickSeries,{upColor:'#24875b',downColor:'#c34e4e',borderUpColor:'#24875b',borderDownColor:'#c34e4e',wickUpColor:'#24875b',wickDownColor:'#c34e4e'})
  const volume=chart.addSeries(HistogramSeries,{priceScaleId:'volume',priceFormat:{type:'volume'},lastValueVisible:false,priceLineVisible:false})
  chart.priceScale('volume').applyOptions({scaleMargins:{top:0.82,bottom:0}})
  chartRef.current=chart;seriesRef.current=series;volumeRef.current=volume
  const observer=new ResizeObserver(entries=>{if(entries[0]&&chartRef.current)chartRef.current.applyOptions({width:entries[0].contentRect.width})})
  observer.observe(host.current)
  return()=>{observer.disconnect();chart.remove();chartRef.current=null;seriesRef.current=null;volumeRef.current=null}
 },[])
 useEffect(()=>{
  if(!seriesRef.current||!volumeRef.current)return
  const valid=(rows||[]).filter(x=>Number.isFinite(x.time)&&x.open>0&&x.high>0&&x.low>0&&x.close>0)
  const data=valid.map(x=>({time:Math.floor(x.time),open:x.open,high:x.high,low:x.low,close:x.close}))
  const volumes=valid.map(x=>({time:Math.floor(x.time),value:x.volume||0,color:x.close>=x.open?'rgba(36,135,91,.42)':'rgba(195,78,78,.42)'}))
  seriesRef.current.setData(data);volumeRef.current.setData(volumes);chartRef.current?.timeScale().fitContent()
 },[rows])
 return <div className="lightweight-chart-wrap"><div ref={host} className="lightweight-chart"/>{!rows?.length&&<div className="chart-overlay">No candle history returned for this security.</div>}</div>
}
