!((window) =>
{
    window.__env = window.__env ||
    {}
})(this);
const _ = document,
    a = localStorage,
    b = setInterval,
    c = clearInterval,
    d = "getElementById",
    e = 'LOADING',
    f = 'READY',
    g = '#fff',
    h = '#000',
    i = 'theme',
    j = 'LOAD_STATUS',
    k = 'textContent',
    l = 'repeat',
    m = 'style',
    n = 'background',
    o = 'color',
	p = 'Attribute',
    q = a.getItem(i) ?? 'light',
    r = _[d](j);
_.documentElement[`set${p}`](i, n);
[r[m][n], r[m][o]] = q === 'light' ? [g, h] : [h, g];
let s = 1,
    t = () =>
    {
        _[d](j)[k] = e + '.' [l](s);
        if (s === 3) s = 0;
        s++;
    },
    u = b(t, 300);
_.addEventListener(j, () =>
{
    const v = _[d](j),
        w = v[`get${p}`]('status');
    if (w === 'loading') u = b(t, 300);
    else
    {
        v[k] = f;
        c(u);
    }
});