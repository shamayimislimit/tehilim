# Fonts bundled with this app

Hebrew text carrying cantillation marks (טעמים) is rendered with two fonts from
the **Culmus project** (https://culmus.sourceforge.io). They were chosen because
they cover the full ta'amim set *and* position the meteg clearly apart from the
vowel — the Noto Hebrew families set it against the segol dots, where it reads
as a qamats (צֶֽדֶק looking like צָדֶק).

| File | Font | Author | Licence |
|---|---|---|---|
| `keter-yg.woff2` | Keter YG (serif) | Yoram Gnat, 2009 | GPL-2 **with font exception** |
| `simple-clm.woff2` | Simple CLM (sans) | Culmus project | GPL-2 **with font exception** |

Keter YG embeds the Biblical Hebrew OpenType layout logic by Ralph Hancock &
John Hudson (MIT licence) — the same mark-positioning logic as SBL Hebrew.

The font exception is what makes embedding legitimate here: *"the GPL does not
apply to a document produced with these fonts, and embedding them in a document
does not make the document subject to the GPL."* Fonts under plain GPL-2 (Frank
Ruehl CLM, Nachlieli CLM, Drugulin CLM…) were deliberately NOT used.

Both files are subsets (Hebrew block + Latin basics + thin/no-break spaces),
produced from the Debian `fonts-culmus` 0.140-3 package with:

    python3 -m fontTools.subset <font> --output-file=<name>.woff2 --flavor=woff2 \
      --unicodes="U+0020-007E,U+00A0,U+2009,U+200E-200F,U+0590-05FF,U+FB1D-FB4F,U+2013-2014,U+2018-201D,U+2026" \
      --layout-features='*' --no-hinting

`--layout-features='*'` is required: dropping the GPOS/GSUB tables would undo
the mark positioning these fonts were picked for.
