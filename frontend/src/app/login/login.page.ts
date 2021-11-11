import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  username:string;
  pass:string;

  login(){

    const username = this.username;
    const pass = this.pass;  

    console.log(username, pass);
      fetch('http://localhost:3000/login',{
          method: 'POST',
          headers: new Headers({
        // Encabezados
       'Content-Type': 'application/json'
        }),
          body: JSON.stringify(
        {

        "username": username,
        "pass": pass
        })
        
      }).then(response=>{
        console.log(response);
        this.router.navigate(['/home']);
        return response.json()
      }).then(r =>{
        console.log(r);
    }).catch(e => console.log(e))

  }
}
