Add-Type -AssemblyName System.Drawing
$bmp=[System.Drawing.Bitmap]::new(1920,1080); $g=[System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias; $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::FromArgb(20,48,83))
$titleFont=[System.Drawing.Font]::new('Arial',[single]35,[System.Drawing.FontStyle]::Bold); $subFont=[System.Drawing.Font]::new('Arial',[single]18); $headFont=[System.Drawing.Font]::new('Arial',[single]23,[System.Drawing.FontStyle]::Bold); $cardFont=[System.Drawing.Font]::new('Arial',[single]20); $smallFont=[System.Drawing.Font]::new('Arial',[single]16)
$white=[System.Drawing.Brushes]::White; $darkBrush=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(24,39,57)); $columnBrush=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(229,235,241)); $cardBrush=[System.Drawing.SolidBrush]::new([System.Drawing.Color]::White); $pen=[System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(200,210,221),2)
$fmt=[System.Drawing.StringFormat]::new(); $fmt.Alignment='Center'; $fmt.LineAlignment='Center'
$g.DrawString('Tableau Kanban - GC Quick',$titleFont,$white,[System.Drawing.RectangleF]::new(0,45,1920,55),$fmt); $g.DrawString('Organisation individuelle du projet',$subFont,$white,[System.Drawing.RectangleF]::new(0,104,1920,30),$fmt)
function Round-Rect($x,$y,$w,$h,$r){$p=[System.Drawing.Drawing2D.GraphicsPath]::new();$p.AddArc($x,$y,$r*2,$r*2,180,90);$p.AddArc($x+$w-$r*2,$y,$r*2,$r*2,270,90);$p.AddArc($x+$w-$r*2,$y+$h-$r*2,$r*2,$r*2,0,90);$p.AddArc($x,$y+$h-$r*2,$r*2,$r*2,90,90);$p.CloseFigure();return $p}
function Column($x,$title,$tasks){$p=Round-Rect $x 175 545 805 16;$g.FillPath($columnBrush,$p);$p.Dispose();$g.DrawString($title,$headFont,$darkBrush,[System.Drawing.RectangleF]::new($x,198,545,32),$fmt);$y=252;foreach($task in $tasks){$p=Round-Rect ($x+22) $y 501 88 11;$g.FillPath($cardBrush,$p);$g.DrawPath($pen,$p);$p.Dispose();$g.DrawString($task,$cardFont,$darkBrush,[System.Drawing.RectangleF]::new($x+42,$y+14,461,44),$fmt);$g.DrawString('Carte de tache',$smallFont,[System.Drawing.Brushes]::Gray,[System.Drawing.RectangleF]::new($x+42,$y+58,461,20),$fmt);$y+=108}}
Column 100 'A faire' @('Ajouter les captures d''ecran','Finaliser le deploiement local','Rediger et relire le memoire')
Column 688 'En cours' @('Tests fonctionnels','Recette de l''application','Ameliorations de l''interface')
Column 1276 'Termine' @('Analyse des besoins','MCD, MLD et MPD','Front-end Angular','API NestJS','Authentification JWT et roles','Demandes, validation et refus')
$out=Join-Path $PSScriptRoot 'Kanban GC Quick.png';$bmp.Save($out,[System.Drawing.Imaging.ImageFormat]::Png)
$fmt.Dispose();$titleFont.Dispose();$subFont.Dispose();$headFont.Dispose();$cardFont.Dispose();$smallFont.Dispose();$darkBrush.Dispose();$columnBrush.Dispose();$cardBrush.Dispose();$pen.Dispose();$g.Dispose();$bmp.Dispose()
