import { getSupabase } from '../services/supabase.js'

export const authenticate = async (req, res, next) => {
  const hdr = req.headers.authorization
  if (!hdr) return res.status(401).json({ msg: 'Kein Token' })
  const token = hdr.split(' ')[1]

  try {
    const supabaseSrv = getSupabase()
    const { data: userData, error } = await supabaseSrv.auth.getUser(token)
    if (error || !userData?.user) return res.status(403).json({ msg: 'Token ungültig' })
    const uid = userData.user.id
    const { data: profiles, error: pErr } = await supabaseSrv
      .from('profiles')
      .select('id,email,name,role')
      .eq('id', uid)
      .limit(1)
    if (pErr) return res.status(500).json({ msg: 'Profilabfrage fehlgeschlagen' })
    if (!profiles?.length) return res.status(401).json({ msg: 'Profil fehlt' })
    req.user = profiles[0]
    next()
  } catch (e) {
    res.status(403).json({ msg: 'Token ungültig' })
  }
}

export const permit = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ msg: 'Keine Rechte' })
