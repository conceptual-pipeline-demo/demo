## How to set up AWS CLI in local
Once you set up the AWS CLI in local, you will be able to interact with AWS by using local command line

1. Install AWS CLI by following the steps from [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. *Request AWS Beach Access* from TW okta home page, you will get the AWS console access automatically some minutes later
3. Auth AWS CLI using SSO
   - add below content to `~/.aws/config`
   ```angular2html
    [profile tw-beach]
    sso_start_url = https://d-99672c8a5f.awsapps.com/start/#
    sso_region = eu-central-1
    sso_account_id = 160071257600
    sso_role_name = PowerUserPlusRole
    region = ap-southeast-2
    output = json
   ```
   - add AWS_PROFILE environment variable, you can add this to `.bash_profile` or `.zshrc` 
   ```angular2html
    export AWS_PROFILE=tw-beach
    ```
   - go to `demo` project, and run:
   ```angular2html
    ./infra/scripts/aws-login
   ```
    you will be redirected to browser to sso to aws console to get access
4. Interact with AWS using AWS CLI
```angular2html
aws s3 ls(list s3)
aws eks list-clusters --region ap-southeast-2(list clusters)
aws eks update-kubeconfig --name conceptual-pipeline --region ap-southeast-2(set default eks cluster)
```
5. Common Kubernetes commands
```angular2html
kubectl get ns(show namespace)
kubectl config set-context --current --namespace=my-namespace(switch namespace)
kubectl get pod -n dev(show pod)
kubectl describe pod demo-c454d9965-vvt88 -n dev
kubectl logs demo-c454d9965-vvt88 -n dev
kubectl exec --stdin --tty podName -- /bin/bash
```
6. install helm in case you want to use helm directoly in command line
```angular2html
brew install helm
```
you can verify by running `helm help`
you can find all the release/upgrade history by running `helm history demo --namespace dev`
7. Nice to have: Simplify Kubernetes command
   - create ~/aws-auth.sh with below content, change the first line path to your path
```angular2html
export AWS_PROFILE=tw-beach
$HOME/Documents/workspace/demo/infra/scripts/aws-login.sh(change this path to your path)
aws eks update-kubeconfig --name conceptual-pipeline --region ap-southeast-2
setNs(){
kubectl config set-context --current --namespace=$1
}
kpod(){
kubectl get pod
}
klog(){
kubectl logs $1
}
kdesc(){
kubectl describe pod $1
}
kexec(){
kubectl exec --stdin --tty $1 -- /bin/bash
}
```
   - everytime when you open the command line, run `source ~/aws-auth.sh`
   - then you can run `setNs dev/uat/prod` to change the namespace
   - run `kpod` to get the pods
   - run `klog podName` to get log of a pod
   - run `kexec podname` to exec to a pod
   