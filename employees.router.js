var express = require('express');	// imports the express library
var router = express.Router();		// Router object for routes
var db = require('./db');

var pageGlobal = `
	<head>
		<!-- Required meta tags -->
		<meta charset="utf-8">
		<metahttp-equiv="X-UA-Compatible"content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<!-- Descriptor meta tags -->
		<title>Employee Database</title>
		<meta name="author" content="Chandler Stevens">
		<meta name="description" content="Displays data regarding business employees.">
		<!-- Bootstrap CSS -->
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	</head>
	<body>
			<table class="table table-striped" id="dbTable" name="dbTable">
				<thead>
					<tr>
	`

var segmentGlobal = `
					</tr>
				</thead>
			<tbody>`;

var footerGlobal = `
			</tbody>
		</table>
		<!-- Optional JavaScript -->
		<!-- jQuery first, then Popper.js, then Bootstrap JS -->
		<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
	</body>`

// Setting home route response
router.get('/', function handleRootGet(request, response) {
		db.connect(function ConnectToDatabase(err) {
			if (err){
				console.log("Unable to Connect to MySQL");
				process.exit(1); //Possibly need to send error page to client
			}
		})
    // Create a static page with links to all 5 requests, or serve that page here
		response.send(`
			<head>
				<!-- Required meta tags -->
				<meta charset="utf-8">
				<metahttp-equiv="X-UA-Compatible"content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
				<!-- Descriptor meta tags -->
				<title>Employee Database</title>
				<meta name="author" content="Chandler Stevens">
				<meta name="description" content="Displays data regarding business employees.">
				<!-- Bootstrap CSS -->
				<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
			</head>
			<body>
				<h1>Home Page<h1>
				<hr />
				<form action="employees" method="GET">
			    <input class="btn btn-raised btn-light shadow mt-3" type="submit" value="Display 30 Employee Names" />
				</form>
				<form action="salaries" method="GET">
			    <input class="btn btn-raised btn-light shadow mt-3" type="submit" value="Display 30 Employee Salaries" />
				</form>
				<form action="departments" method="GET">
			    <input class="btn btn-raised btn-light shadow mt-3" type="submit" value="Display 30 Employee Departments" />
				</form>
				<form action="bosses" method="GET">
			    <input class="btn btn-raised btn-light shadow mt-3" type="submit" value="Display 30 Employee Bosses" />
				</form>
				<form action="all" method="GET">
			    <input class="btn btn-raised btn-light shadow mt-3" type="submit" value="Display 30 Employee Details" />
				</form>
				<!-- Optional JavaScript -->
				<!-- jQuery first, then Popper.js, then Bootstrap JS -->
				<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
				<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
			</body>
		`
		);
});
// Setting the more-info response
router.get('/employees', function (request, response) {
	db.get().query(`
		SELECT
			E.first_name AS emp_first_name,
			E.last_name AS emp_last_name
		FROM
			employees E
		LIMIT 30`,
		function (err, result, fields) {
			if (err) throw err;
			let page = pageGlobal;
			let segment = segmentGlobal;
			let footer = footerGlobal;
			page += `
				<th scope="col">Employee First Name</th>
				<th scope="col">Employee Last Name</th>
				`
			page += segment;
			for (var i = 0; i < 30; i++) {
				page += "<tr>";
				page += "<td>" + result[i].emp_first_name + "</td>";
				page += "<td>" + result[i].emp_last_name + "</td>";
				page += "</tr>";
			}
			page += footer
			response.send(page);
		})
});

router.get('/salaries', function (request, response) {
	db.get().query(`
		SELECT
			E.first_name AS emp_first_name,
			E.last_name AS emp_last_name,
			S.salary
		FROM
			employees E,
			salaries S
		WHERE
			E.emp_no=S.emp_no AND
			S.to_date='9999-01-01'
		LIMIT 30`,
		function (err, result, fields) {
			if (err) throw err;
			let page = pageGlobal;
			let segment = segmentGlobal;
			let footer = footerGlobal;
			page += `
				<th scope="col">Employee First Name</th>
				<th scope="col">Employee Last Name</th>
				<th scope="col">Current Salary</th>
				`
			page += segment;
			for (var i = 0; i < 30; i++) {
				page += "<tr>";
				page += "<td>" + result[i].emp_first_name + "</td>";
				page += "<td>" + result[i].emp_last_name + "</td>";
				page += "<td>$ " + result[i].salary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); + "</td>";
				page += "</tr>";
			}
			page += footer
			response.send(page);
		})
});

router.get('/departments', function (request, response) {
	db.get().query(`
		SELECT
		  E.first_name AS emp_first_name,
		  E.last_name AS emp_last_name,
		  D.dept_name
		FROM
		  employees E,
		  dept_emp DE,
		  departments D
		WHERE
			E.emp_no = DE.emp_no AND
			DE.dept_no=D.dept_no AND
			DE.to_date='9999-01-01'
		LIMIT 30`,
		function (err, result, fields) {
			if (err) throw err;
			let page = pageGlobal;
			let segment = segmentGlobal;
			let footer = footerGlobal;
			page += `
				<th scope="col">Employee First Name</th>
				<th scope="col">Employee Last Name</th>
				<th scope="col">Department</th>
				`
			page += segment;
			for (var i = 0; i < 30; i++) {
				page += "<tr>";
				page += "<td>" + result[i].emp_first_name + "</td>";
				page += "<td>" + result[i].emp_last_name + "</td>";
				page += "<td>" + result[i].dept_name + "</td>";
				page += "</tr>";
			}
			page += footer
			response.send(page);
		})
});

router.get('/bosses', function (request, response) {
	db.get().query(`
		SELECT
		  E.first_name AS emp_first_name,
		  E.last_name AS emp_last_name,
		  B.first_name AS boss_first_name,
		  B.last_name AS boss_last_name
		FROM
		  employees E,
		  dept_emp DE,
		  departments D,
		  dept_manager DM,
		  employees B
		WHERE
		  E.emp_no = DE.emp_no AND
		  DE.dept_no=D.dept_no AND
		  DE.to_date='9999-01-01' AND
		  DM.to_date='9999-01-01' AND
		  D.dept_no=DM.dept_no AND
		  B.emp_no=DM.emp_no
		LIMIT 30`,
		function (err, result, fields) {
			if (err) throw err;
			let page = pageGlobal;
			let segment = segmentGlobal;
			let footer = footerGlobal;
			page += `
				<th scope="col">Employee First Name</th>
				<th scope="col">Employee Last Name</th>
				<th scope="col">Boss First Name</th>
				<th scope="col">Boss Last Name</th>
				`
			page += segment;
			for (var i = 0; i < 30; i++) {
				page += "<tr>";
				page += "<td>" + result[i].emp_first_name + "</td>";
				page += "<td>" + result[i].emp_last_name + "</td>";
				page += "<td>" + result[i].boss_first_name + "</td>";
				page += "<td>" + result[i].boss_last_name + "</td>";
				page += "</tr>";
			}
			page += footer
			response.send(page);
		})
});

router.get('/all', function (request, response) {
	db.get().query(`
		SELECT
		  E.first_name AS emp_first_name,
		  E.last_name AS emp_last_name,
			S.salary,
		  D.dept_name,
		  B.first_name AS boss_first_name,
		  B.last_name AS boss_last_name
		FROM
		  employees E,
			salaries S,
		  dept_emp DE,
		  departments D,
		  dept_manager DM,
		  employees B
		WHERE
		  E.emp_no = DE.emp_no AND
			E.emp_no=S.emp_no AND
			S.to_date='9999-01-01' AND
		  DE.dept_no=D.dept_no AND
		  DE.to_date='9999-01-01' AND
		  DM.to_date='9999-01-01' AND
		  D.dept_no=DM.dept_no AND
		  B.emp_no=DM.emp_no
		LIMIT 30`,
		function (err, result, fields) {
			if (err) throw err;
			let page = pageGlobal;
			let segment = segmentGlobal;
			let footer = footerGlobal;
			page += `
				<th scope="col">Employee First Name</th>
				<th scope="col">Employee Last Name</th>
				<th scope="col">Current Salary</th>
				<th scope="col">Department</th>
				<th scope="col">Boss First Name</th>
				<th scope="col">Boss Last Name</th>
				`
			page += segment;
			for (var i = 0; i < 30; i++) {
				page += "<tr>";
				page += "<td>" + result[i].emp_first_name + "</td>";
				page += "<td>" + result[i].emp_last_name + "</td>";
				page += "<td>$ " + result[i].salary.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); + "</td>";
				page += "<td>" + result[i].dept_name + "</td>";
				page += "<td>" + result[i].boss_first_name + "</td>";
				page += "<td>" + result[i].boss_last_name + "</td>";
				page += "</tr>";
			}
			page += footer
			response.send(page);
		})
});

// Exporting the router "object"
module.exports = router;
