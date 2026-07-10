program test

  !$acc parallel loop collapse(3) copy(x)
  do i = 1, n
    x(i) = x(i) + 1
  end do

end program test
