import { useEffect, useState } from 'react'
import { apiGet, apiPost } from './lib/api'

function Header() {
  return (
    <div className="p-4 sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <img src="/logo.png" alt="ORDERBUDDY" className="h-10 w-10" />
        <div>
          <div className="text-xl font-bold text-orange-600">ORDERBUDDY</div>
          <div className="text-xs text-gray-500">Multi-service delivery</div>
        </div>
      </div>
    </div>
  )
}

function BannerSlider({ banners }){
  return (
    <div className="overflow-x-auto whitespace-nowrap no-scrollbar py-3">
      {banners.map((b,i)=> (
        <img key={i} src={b.image_url} alt={b.title} className="inline-block h-36 w-[320px] rounded-xl object-cover mx-2 shadow" />
      ))}
    </div>
  )
}

function Categories({ categories, onPick }){
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {categories.map((c, i)=> (
        <button key={i} onClick={()=> onPick(c.name)} className="rounded-xl p-4 bg-orange-50 hover:bg-orange-100 transition text-center border">
          <div className="text-sm font-semibold capitalize text-orange-700">{c.name}</div>
        </button>
      ))}
    </div>
  )
}

function ShopCard({ shop }){
  return (
    <div className="rounded-xl overflow-hidden border bg-white">
      <img src={shop.image_url} alt={shop.name} className="h-40 w-full object-cover" />
      <div className="p-3">
        <div className="font-semibold">{shop.name}</div>
        <div className="text-xs text-gray-500">{shop.address}</div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full ${shop.open_now? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{shop.open_now? 'Open' : 'Closed'}</span>
          <span>⭐ {shop.rating}</span>
          <span>Min ₹{Math.round(shop.min_order)}</span>
          {!shop.open_now && shop.next_opening && <span className="text-gray-500">Opens {shop.next_opening}</span>}
        </div>
      </div>
    </div>
  )
}

function Home(){
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [shops, setShops] = useState([])
  const [active, setActive] = useState('all')

  useEffect(()=>{
    apiGet('/banners').then(setBanners).catch(()=>{})
    apiGet('/categories').then(setCategories).catch(()=>{})
    apiGet('/shops').then(setShops).catch(()=>{})
  },[])

  const filtered = active==='all'? shops : shops.filter(s=> s.category===active)

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="rounded-2xl p-4 bg-gradient-to-r from-orange-50 to-green-50 border">
          <div className="flex items-center gap-3">
            <input placeholder="Search for restaurants, groceries..." className="w-full p-3 rounded-xl border focus:outline-none" />
          </div>
        </div>

        <BannerSlider banners={banners} />

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button onClick={()=> setActive('all')} className={`px-3 py-1 rounded-full border ${active==='all'?'bg-orange-600 text-white border-orange-600':'bg-white'}`}>All</button>
          {categories.map((c)=> (
            <button key={c.name} onClick={()=> setActive(c.name)} className={`px-3 py-1 rounded-full border capitalize ${active===c.name?'bg-orange-600 text-white border-orange-600':'bg-white'}`}>{c.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s)=> <ShopCard key={String(s._id)} shop={s} />)}
        </div>
      </div>
    </div>
  )
}

export default function App(){
  return <Home />
}
