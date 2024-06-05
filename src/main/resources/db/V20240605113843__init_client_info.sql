insert into client_info(id, name, gender, email, phone, address)
values ('1', 'bob', 'male', 'bob@gmail.com', '123456', 'somewhere') on conflict do nothing;