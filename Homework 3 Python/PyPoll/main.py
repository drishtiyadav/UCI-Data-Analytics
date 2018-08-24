import os
import csv

csvpath = os.path.join('..', 'PyPoll', 'election_data.csv')

with open(csvpath, newline='') as csvfile:

	PyPoll = csv.reader(csvfile, delimiter=',')

	csv_header = next(PyPoll)

	# initiating the empty lists for candidates and votes
	votes_list =[]
	candidate_list = []
	
	for row in PyPoll:

		# Filling the fill with votes cast
		votes_list.append(row[2])

		# Filling the list for the names of candidates
		if row[2] not in candidate_list:
			candidate_list.append(row[2])

	# Opening the text file for writing the output 
	with open('outfile.txt', 'w') as outfile:		

		# Printing the total number of votes cast
		total_votes = len(votes_list)

		print("\nElection Results")
		print("--------------------------------")
		print("Total Votes: " + str(total_votes))	
		print("--------------------------------")

		# Writing the same to the output file
		#outfile.write("\nElection Results\n" + "--------------------------------\n" + "Total Votes: " + str(total_votes) + "\n--------------------------------\n")
		outfile.write("\nElection Results")
		outfile.write("\n--------------------------------\n")
		outfile.write("Total Votes: " + str(total_votes))	
		outfile.write("\n--------------------------------\n")	

		# Creating a dictionary with candidates as keys and count of votes received as values
		# Logic - number of times a name appears in the votes list
		votes_tally = {candidate:votes_list.count(candidate) for candidate in candidate_list}

		# Creating a dictionary with candidates as keys and percent votes received as values
		percent_votes = {candidate:((vote_count/total_votes)*100) for candidate, vote_count in votes_tally.items()}

		# Printing the names of candidates, percent of votes and number of votes received
		# logic - run nested loops through both dictionaries and print values with same keys (candidates)
		for candidate, pc in percent_votes.items():
			for k,v in votes_tally.items():
				if k==candidate:
					print("".join("{}: {:5.3f}% ({})".format(k,pc,v)))
					outfile.write("".join("{}: {:5.3f}% ({})\n".format(k,pc,v)))

		# Calculating the candidate (key) with maximum number of votes received and printing/writing the same in specified format			
		print("--------------------------------")
		print("".join("Winner: {}".format(candidate) for candidate, vote_count in votes_tally.items() if vote_count == max(votes_tally.values())))
		print("--------------------------------")

		outfile.write("--------------------------------\n")
		outfile.write("".join("Winner: {}".format(candidate) for candidate, vote_count in votes_tally.items() if vote_count == max(votes_tally.values())))
		outfile.write("\n--------------------------------")
	
# x-----End-------x 

					
