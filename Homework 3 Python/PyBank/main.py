import os
import csv

csvpath = os.path.join('..', 'PyBank', 'PyBank.csv')

with open(csvpath, newline='') as csvfile:

	PyBank = csv.reader(csvfile, delimiter=',')

	csv_header = next(PyBank)

	# Opening the output file to write the output

	with open("Output.txt", "w") as outfile:

		# Initializing the empty lists for Date and Revenue data

		date_list = []
		revenue_list = []

		# Extracting data into lists for Date and Revenue

		for row in PyBank:
			date_list.append(row[0])
			revenue_list.append(row[1])

		
		# +++++++++ Calculating total months ++++++++++++++
		# Date field being unique and month-wise, total months will be length of the list		

		total_months = 	len(date_list)

		print("\nFinancial Analysis\n------------------------------------")
		print(f"Total Months: {total_months}")
		outfile.write(f"\nFinancial Analysis\n------------------------------------\nTotal Months: {total_months}")

		# Initializing a variable for calculating the total revenue

		sum_revenue = 0

		# ++++++++++ Calculating total revenue ++++++++++++

		for revenue in revenue_list:
			sum_revenue += int(revenue)

		print("Total: $" + str(sum_revenue))
		outfile.write("\nTotal: $" + str(sum_revenue))	

		# +++++++++ Calculating average change ++++++++++++
		# Initializing an empty list for month-by-month change and a counter for sum of all changes

		change_list = []
		change_sum = 0

		# loop for finding month-by-month change and sum of all changes

		for i in range(total_months-1):
			change_value = int(revenue_list[i+1]) - int(revenue_list[i])
			change_list.append(change_value)
			change_sum += change_value

		average_change = change_sum/(total_months-1)

		print("Average Change: $" + str(average_change))
		outfile.write("\nAverage Change: $" + str(average_change) )

		# +++++++++ Calculating greatest increase and greatest decrease in revenue +++++++++

		greatest_profit_change = 0
		greatest_loss_change = 0

		for i in range(total_months-1):

			if change_list[i] > greatest_profit_change:
				greatest_profit_change = change_list[i]

			elif change_list[i] < greatest_loss_change:
				greatest_loss_change = change_list[i]

		# Finding the indexes / positions for greatest increase and decrease in revenue to find the corresponding values in date and revenue list 		

		p_profit = change_list.index(greatest_profit_change) + 1
		p_loss = change_list.index(greatest_loss_change) + 1

		print(f"Greatest Increase in Revenue: {date_list[p_profit]} (${revenue_list[p_profit]})")
		print(f"Greatest Decrease in Revenue: {date_list[p_loss]} (${revenue_list[p_loss]})")
		outfile.write(f"\nGreatest Increase in Revenue: {date_list[p_profit]} (${revenue_list[p_profit]})")
		outfile.write(f"\nGreatest Decrease in Revenue: {date_list[p_loss]} (${revenue_list[p_loss]})")	
    
# x-----End-------x 
