set terminal png

set title "Memory over Time"
set xlabel "Time"
set ylabel "Memory"

set xdata time
set timefmt "%s"
set format x "%S"
#set xrange [0:1]
set key below
set grid
set style line 1 lt 1 lw 3 pt 3

plot "data.txt" using 1:12 smooth csplines
