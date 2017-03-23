# snomed-ct-ancestry

Command line utility to generate ancestors lists for review activities

## Install

`npm install -g snomed-ct-ancestry`

## Use

Run from the command line:

`ancestry -r [path-to-rf2-relationships-snapshot] -d [path-to-rf2-descriptions-snapshot] -i [path-to-input-file]`

The input file should be a tab delimited file with 2 columns, ConceptId and Term.

# Output

The tool generates the output as a tab delimited file, named "ancestorsForList.txt", that contains 4 columns:
* ConceptId: for one of the concepts in the input list
* FSN: for the same concept
* Ancestor ConceptId: for one of the ancestors of the concept
* Ancestor FSN: for the same ancestor

Example:

```
ConceptId	FSN	Ancestor ConceptId	Ancestor FSN
200001	Berberine (substance)	45695000	Plant alkaloid (substance)
200001	Berberine (substance)	301054007	Phytochemical (substance)
200001	Berberine (substance)	62873003	Plant agent (substance)
200001	Berberine (substance)	373285005	Naturally occurring alkaloid (substance)
200001	Berberine (substance)	312414008	Chemical categorized functionally (substance)
200001	Berberine (substance)	312412007	Substance categorized functionally (substance)
200001	Berberine (substance)	441900009	Chemical (substance)
200001	Berberine (substance)	105590001	Substance (substance)
200001	Berberine (substance)	138875005	SNOMED CT Concept (SNOMED RT+CTV3)
200001	Berberine (substance)	256248008	Plant material (substance)
200001	Berberine (substance)	289958009	Organic natural material (substance)
200001	Berberine (substance)	260786008	Natural material (substance)
200001	Berberine (substance)	115668003	Biological substance (substance)
200001	Berberine (substance)	260769002	Material (substance)
200001	Berberine (substance)	419001004	Alkaloid (substance)
200001	Berberine (substance)	116280007	Heterocyclic compound (substance)
200001	Berberine (substance)	41175001	Organic compound (substance)
200001	Berberine (substance)	312415009	Chemical categorized structurally (substance)
```
