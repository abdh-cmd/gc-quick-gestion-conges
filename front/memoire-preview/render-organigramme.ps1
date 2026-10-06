Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::new(1600, 1380)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::White)
$linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(82, 101, 126), 3)
$borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(36, 51, 76), 2.5)
$titleFont = [System.Drawing.Font]::new('Arial', [single]34, [System.Drawing.FontStyle]::Bold)
$roleFont = [System.Drawing.Font]::new('Arial', [single]16)
$nameFont = [System.Drawing.Font]::new('Arial', [single]22, [System.Drawing.FontStyle]::Bold)
$center = [System.Drawing.StringFormat]::new(); $center.Alignment = 'Center'; $center.LineAlignment = 'Center'

function Draw-Box($x, $y, $w, $h, $color, $role, $name, $light) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $r = 12
  $path.AddArc($x, $y, $r*2, $r*2, 180, 90); $path.AddArc($x+$w-$r*2, $y, $r*2, $r*2, 270, 90)
  $path.AddArc($x+$w-$r*2, $y+$h-$r*2, $r*2, $r*2, 0, 90); $path.AddArc($x, $y+$h-$r*2, $r*2, $r*2, 90, 90); $path.CloseFigure()
  $fillBrush = [System.Drawing.SolidBrush]::new($color); $g.FillPath($fillBrush, $path); $g.DrawPath($borderPen, $path)
  $brush = if ($light) { [System.Drawing.Brushes]::White } else { [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(23,32,51)) }
  $g.DrawString($role, $roleFont, $brush, [System.Drawing.RectangleF]::new($x, $y+14, $w, 34), $center)
  $g.DrawString($name, $nameFont, $brush, [System.Drawing.RectangleF]::new($x, $y+47, $w, 34), $center)
  $path.Dispose(); $fillBrush.Dispose(); if (-not $light) { $brush.Dispose() }
}

$titleBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(23,32,51))
$g.DrawString('Organigramme - Quick Rosny DI 2', $titleFont, $titleBrush, [System.Drawing.RectangleF]::new(0,25,1600,55), $center)
$g.DrawLine($linePen,800,205,800,280); $g.DrawLine($linePen,800,365,800,410); $g.DrawLine($linePen,800,495,800,540); $g.DrawLine($linePen,800,625,800,790); $g.DrawLine($linePen,390,790,1160,790); $g.DrawLine($linePen,390,790,390,825); $g.DrawLine($linePen,1160,790,1160,825)
$g.DrawLine($linePen,1160,935,1160,980); $g.DrawLine($linePen,540,980,1160,980); foreach($x in @(540,1060)) { $g.DrawLine($linePen,$x,980,$x,1015) }
$g.DrawLine($linePen,540,1120,540,1165); $g.DrawLine($linePen,1060,1120,1060,1165); $g.DrawLine($linePen,540,1165,1060,1165); $g.DrawLine($linePen,800,1165,800,1190)

Draw-Box 580 110 440 95 ([System.Drawing.Color]::FromArgb(23,54,93)) 'Direction Quick France' 'Operations, marketing, RH...' $true
Draw-Box 580 280 440 85 ([System.Drawing.Color]::FromArgb(47,85,151)) 'Franchise' 'El Machkour Abdellah' $true
Draw-Box 580 410 440 85 ([System.Drawing.Color]::FromArgb(47,85,151)) 'Superviseur' 'Sonko Cherif' $true
Draw-Box 580 540 440 85 ([System.Drawing.Color]::FromArgb(47,85,151)) 'Directeur et tuteur' 'Bouaassria Aziz' $true
Draw-Box 170 825 440 110 ([System.Drawing.Color]::FromArgb(220,230,241)) 'Ressources humaines' 'Quantin Nadege' $false
Draw-Box 940 825 440 110 ([System.Drawing.Color]::FromArgb(220,230,241)) 'Manager' 'Perrin Jerome' $false
Draw-Box 360 1015 360 105 ([System.Drawing.Color]::FromArgb(220,230,241)) 'Equipier expert' 'Tetbirt Mustapha' $false
Draw-Box 880 1015 360 105 ([System.Drawing.Color]::FromArgb(220,230,241)) 'Equipier expert - support informatique' 'Moudjahed Abdelhakim' $false
Draw-Box 600 1190 400 105 ([System.Drawing.Color]::FromArgb(220,230,241)) 'Equipe' '30 equipiers polyvalents' $false

$bmp.Save((Join-Path $PSScriptRoot 'Organigramme Quick.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$titleBrush.Dispose(); $center.Dispose(); $titleFont.Dispose(); $roleFont.Dispose(); $nameFont.Dispose(); $linePen.Dispose(); $borderPen.Dispose(); $g.Dispose(); $bmp.Dispose()
