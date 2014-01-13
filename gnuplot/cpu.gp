set terminal png

set title "CPU over Time"
set xlabel "Time"
set ylabel "CPU"

set xdata time
set timefmt "%s"
set format x "%S"
#set xrange [0:1]
set key below
set grid
set style line 1 lt 1 lw 3 pt 3

plot "data.txt" using 1:7 smooth csplines
