<?php
session_start();
require_once "../connection.php";

// Check cookies exist or not
if (!isset($_SESSION['user'])) {
  $_SESSION['success'] = false;
  $_SESSION['message'] = "Authentication failed";
  header("location: $appUrl/login.php");
} else if (isset($_SESSION["role"]) && $_SESSION["role"] != "doctors") {
  setcookie('user', '', time() - 3600, '/');
  $_SESSION['success'] = false;
  $_SESSION['message'] = "You are not authorized to access the Doctor site.";
  header("location: $appUrl/login.php");
  exit;
}

$pageTitle = "Dashboard";
require_once "../components/header.php";

// Count Data to show at the dashboard
try {

  // Fetch booked appointments for the doctor
  $doctorId = $_SESSION['id'];
  $appointments = $connection->prepare("SELECT COUNT(*) as appointmentCount,
                                     d.email AS doctor_email
                                     FROM appointments a
                                     JOIN patients p ON a.patient_id = p.id
                                     JOIN doctors d ON a.doctor_id = d.id
                                     WHERE a.doctor_id = $doctorId");

  $appointments->execute();
  $appointmentsResult = $appointments->get_result();
  $doctorAppointments = $appointmentsResult->fetch_assoc();
} catch (PDOException $e) {
  echo "Error: " . $e->getMessage();
}

?>
<div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
  <!-- Sidebar Start -->
  <aside class="left-sidebar">
    <!-- Sidebar scroll-->
    <div>
      <div class="brand-logo d-flex align-items-center justify-content-between">
        <a href="<?php echo $appUrl; ?>" class="navbar-brand" style="font-size:30px">
          Hospital
        </a>
        <div class="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
          <i class="fa fa-times"></i>
        </div>
      </div>
      <!-- Sidebar navigation-->
      <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
        <div class="sidebar">
          <ul id="sideNav">
          </ul>
        </div>
      </nav>
    </div>
  </aside>
  <!--  Sidebar End -->
  <!--  Main wrapper -->
  <div class="body-wrapper">
    <!--  Header Start -->
    <?php require_once "../components/profileHeader.php" ?>
    <!--  Header End -->
    <div class="p-5">
      <?php
      if (isset($_SESSION['message']) && isset($_SESSION['success'])) {
        $message = $_SESSION['message'];
        $success = $_SESSION['success'];
        $toastType = $success ? 'success' : 'error';
        echo "<script>
          toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 2000,
            progressBar: true,
          }; toastr.$toastType('$message');</script>";
        unset($_SESSION['message']);
        unset($_SESSION['success']);
      }
      ?>
      <div>
        <h3>Dashboard</h3>
      </div>
    </div>
    <div class="row dashboard-widget-p-5">
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3 dashboard-widget mt-md-0 mt-sm-0 mt-3">
      <a href="./appointments.php">
        <div class="bg-warning cursor-pointer gradient-style1 text-white box-shadow widget-style3 rounded">
          <div class="d-flex flex-wrap align-items-center">
            <div class="widget-data">
              <div class="" style="font-weight: 400;font-size: 20px;line-height: 1.5em;">Appointments</div>
              <div class="" style="font-weight: 300;font-size: 30px;line-height: 1.46em;"><?php echo $doctorAppointments['appointmentCount']; ?></div>
            </div>
            <div>
              <div><i class="fa-solid fa-calendar" style="font-size:1.875rem"></i></div>
            </div>
          </div>
        </div>
        </a>  
      </div>
    </div>
  </div>
</div>

<script src="./doctor.js"></script>
<?php
require_once "../components/footer.php";
?>