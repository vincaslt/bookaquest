<style>
  .container {
    background-color: #430040;
    width: 100%;
    padding: 75px 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  h3 {
    margin-top: 0;
    color: white;
    font-weight: 400;
  }

  input {
    border: none;
    background-color: white;
    padding: 15px;
    height: 50px;
    display: flex;
    flex: 1 1 200px;
    min-width: 200px;
    border-radius: 6px;
  }

  button {
    display: flex;
    padding: 15px 25px;
    color: #ffe5fe;
    background-color: #80007A;
    border: none;
    border-radius: 50px;
    margin-left: 20px;
    font-size: 18px;
    font-weight: 600;
    max-width: 220px;
    cursor: pointer;
  }

  button:hover {
    color: #80007A;
    background-color: #ffe5fe;
  }

  .input-container {
    display: flex;
  }

  .subscribe {
    max-width: 700px;
    width: 100%;
  }

  @media(max-width: 600px) {
    .input-container {
      flex-direction: column;
      align-items: center;
    }

    input {
      flex: 0;
      width: 100%;
    }

    button {
      margin: 15px;
    }
  }  
</style>

<div class="container">
  <form class="subscribe">
    <h3>We will let you know when we launch</h3>
    <div class="input-container">
      <input type="text" placeholder="Enter Email Address" />
      <button>SIGN ME UP</button>
    </div>
  </form>
</div>
