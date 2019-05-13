<style>
  .container {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .hero-image {
    display: flex;
    flex: 1 1 200px;
    min-width: 400px;
    max-width: 700px;
  }

  h1 {
    color: #444C59;
    font-size: 48px;
    font-weight: 400;
    margin: 0 0 10px 0;
  }

  .hero-text {
    flex: 0 1 auto;
    margin: 50px 20px 50px 0;
  }

  p {
    margin-top: 40px;
    color: #7D909D;
    font-size: 24px;
    max-width: 500px;
  }

  @media(max-width: 600px) {
    .hero-image  {
			padding: 15px;
      min-width: 290px;
		}

    .hero-text, p {
      margin-bottom: 0;
    }
  }
</style>

<div class="container">
  <div class="hero-text">
    <h1>Save time.</h1>
    <h1>Avoid mistakes.</h1>
    <h1>Get more bookings.</h1>

    <p>
      Create a booking form with our simple form builder,
      add a line of code or put a link in your website, and
      manage booking requests in your personal dashboard.
      <br /><br />
      Emails and calls are so old-fashioned...
    </p>
  </div>
  <img class="hero-image" alt="Create booking form; manage your bookings" src="/hero-image.svg" />
</div>