INTERVAL ?= 1
COUNT ?= 60

# Time   UID       PID    %usr %system  %guest    %CPU   CPU  minflt/s  majflt/s     VSZ    RSS   %MEM  Command
MEM_COL = 12

monitor:
	pidstat -p `pgrep node` -h -r -u $(INTERVAL) $(COUNT) | tail -n +3 | sed -e "/#.*/d" -e "/^\s*$$/d" > gnuplot/data.txt

graphs:
	