const { shuffle, sample, flatten } = require("underscore")

const { indicesInString } = require("../../../../lib/helpers")

module.exports = word => {
  const substrings = Object.keys(misspellings).filter(s => word.includes(s))
  return flatten(
    substrings.map(substring =>
      indicesInString(word, substring).map(idx =>
        misspellings[substring].map(misspelling => {
          const split = word.split("")
          split.splice(idx, substring.length, misspelling)
          return split.join("")
        })
      )
    )
  )
}

const misspellings = {
  b: ["p"],
  c: ["s", "k"],
  ch: ["k", "c"],
  ck: ["k", "ch"],
  d: ["th"],
  f: ["ph"],
  g: ["j"],
  h: [""],
  j: ["g"],
  k: ["ch", "ck"],
  l: ["r"],
  m: ["n"],
  n: ["m"],
  p: ["b", "d"],
  ph: ["f"],
  qu: ["k"],
  r: ["l"],
  s: ["c", "z"],
  sk: ["ks"],
  t: ["d", "th"],
  th: ["d", "t"],
  v: ["w", "b"],
  w: ["v", "b"],
  x: ["z", "ks"],
  y: ["i", "ee"],
  z: ["s"],
  a: ["e", "i", "o", "u", ""],
  e: ["a", "i", "o", "u", ""],
  i: ["a", "e", "o", "u", ""],
  o: ["a", "e", "i", "u", ""],
  u: ["a", "e", "i", "o", "ou", ""],
  ae: ["ay", "a", "ea"],
  au: ["ow", "ua", "u"],
  ai: ["ay", "ia", "a"],
  aw: ["a", "au"],
  ay: ["ai", "a"],
  ee: ["e", "i"],
  ei: ["ie", "e"],
  eu: ["u", "ue"],
  ia: ["ea", "ai"],
  ie: ["ei"],
  ou: ["ow", "u", "uo"],
  oy: ["oi", "oe"],
  oi: ["oy", "oe"],
  ow: ["o", "au"],
  bb: ["b"],
  cc: ["c"],
  dd: ["d"],
  ff: ["f"],
  gg: ["g"],
  jj: ["j"],
  kk: ["k"],
  ll: ["l"],
  mm: ["m"],
  nn: ["n"],
  pp: ["p"],
  rr: ["r"],
  ss: ["s"],
  tt: ["t"],
  vv: ["v"],
  ww: ["w"],
  zz: ["z"],
  b: ["bb"],
  c: ["cc"],
  d: ["dd"],
  f: ["ff"],
  g: ["gg"],
  j: ["jj"],
  k: ["kk"],
  l: ["ll"],
  m: ["mm"],
  n: ["nn"],
  p: ["pp"],
  r: ["rr"],
  s: ["ss"],
  t: ["tt"],
  v: ["vv"],
  w: ["ww"],
  z: ["zz"]
}
